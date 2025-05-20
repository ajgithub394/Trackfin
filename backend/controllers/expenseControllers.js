const User = require("../models/User");
const Expense = require("../models/Expense");

//Add Expense category
exports.addExpense = async (req,res) =>{
    const userId = req.user.id;

    try{
        const {icon, category, amount, date} = req.body;
        if(!category || !amount || !date){
            return res.status(400).json({message : "All fields are required"});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date : new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    }catch(err){
        res.status(500).json({message : "Server error"});
    }
}

//Get all income
exports.getAllExpense = async (req,res)=>{
    const userId = req.user.id;
    try{
        const expense = await Expense.find({userId}).sort({date : -1});
        res.json(expense);
    }catch(error){
        res.status(500).json({message : "Server Error"});
    }
}

//delete income source
exports.deleteExpense = async (req,res)=>{
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message : "Income deleted successfully"});
    }catch(err){
        res.status(500).json({message : "Server error"});
    }
}

// Download Income Excel
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expense');

        // Define columns
        worksheet.columns = [
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Date', key: 'date', width: 15 }
        ];

        // Add rows
        expense.forEach(item => {
            worksheet.addRow({
                category: item.category,
                amount: item.amount,
                date: item.date
            });
        });

        // Apply some styling
        worksheet.getRow(1).font = { bold: true };
        worksheet.getColumn('amount').numFmt = '#,##0.00';
        worksheet.getColumn('date').numFmt = 'yyyy-mm-dd';

        // Create a specific directory path that's easily visible in your project
        const filePath = path.join(process.cwd(), 'downloads', 'expense_details.xlsx');
        
        // Ensure the downloads directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        console.log(`Saving Excel file to: ${filePath}`);
        
        // Write to file
        await workbook.xlsx.writeFile(filePath);
        console.log(`File successfully written to: ${filePath}`);
        
        // Send the file to the client, but DON'T delete it after download
        res.download(filePath, 'expense_details.xlsx', (err) => {
            if (err) {
                console.error("Download error:", err);
            }
            // Note: No file deletion here so you can see it in your project
            console.log("File should now be available in your project's downloads folder");
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
