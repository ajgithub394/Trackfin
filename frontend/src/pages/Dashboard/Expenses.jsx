import React, { useEffect, useState } from 'react'
import {useUserAuth} from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expenses = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show:false,
    data : null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  //get all expense details
  const fetchExpenseDetails = async () =>{
    if(loading) return;

    setLoading(true);

    try{
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);

      if(response.data){
        setExpenseData(response.data);
      }

    }catch(error){
      console.log("Something went wrong...please try again",error);
    } finally{
      setLoading(false);
    }
  };

  //handle add expense
  const handleAddExpense = async (expense) =>{
    const {category, amount, date, icon} = expense;

    //Validation Checks
    if(!category.trim()){
      toast.error("Category is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be a valid positive number");
      return;
    }

    if(!date){
      toast.error("Date is required");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense Added Successfully");
      fetchExpenseDetails();

    }catch(error){
      console.error("Error Adding Expense",error.response?.data?.message || error.message);
    }
  };

  useEffect(()=>{
    fetchExpenseDetails();

    return () => {};
  },[]);

  //delete expense
  const deleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show : false, data : null});
      toast.success("Expense Deleted Successfully");
      fetchExpenseDetails();
    }catch(error){
      console.error("Error Deleting Expense",error.response?.data?.message || error.message);
    }
  };

  //handle download income details
  const handleDownloadExpenseDetails = async () =>{
    try{
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{responseType : "blob"});

      //create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download","expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }catch(error){
      console.error("Error Downloading Expense Details",error);
      toast.error("Failed to download expense details");
    }
  };

  return (
    <DashboardLayout activeMenu="Expenses">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
            transactions = {expenseData}
            onAddExpense= {() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
          transactions = {expenseData}
          onDelete = {(id) => setOpenDeleteAlert({show : true, data : id})}
          onDownload={handleDownloadExpenseDetails}
          />

        </div>

        <Modal
        isOpen={openAddExpenseModal}
        onClose={() => setOpenAddExpenseModal(false)}
        title="Add Expense">
          <AddExpenseForm onAddExpense = {handleAddExpense}/>
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({show : false, data : null})}
        title="Delete Expense"
        >
          <DeleteAlert
          content = "Do you really want to delete this expense detail?"
          onDelete = {() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>


      </div>
    </DashboardLayout>
  )
}

export default Expenses