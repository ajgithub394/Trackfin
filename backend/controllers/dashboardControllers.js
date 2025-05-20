const Income = require("../models/Income");
const Expense = require("../models/Expense");
const {isValidObjectId, Types} = require("mongoose");

//Dashboard Data
exports.getDashboardData = async (req,res)=>{
    try{
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //fetch total income and expenses
        const totalIncome = await Income.aggregate([
            {$match : {userId : userObjectId}},
            {$group : {_id : null, total : {$sum : "$amount"}}},
        ]);

        console.log("totalIncome",{totalIncome, userId : isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            {$match : {userId : userObjectId}},
            {$group : {_id:null, total : {$sum : "$amount"}}},
        ]);

        //get income transactions in the last 60 days
        const last60daysIncomeTransactions = await Income.find({
            userId,
            date : {$gte : new Date(Date.now() - 60*24*60*60*1000)},
        }).sort({date : -1});

        //get totalIncome for the lasr 60 days
        const last60daysIncome = last60daysIncomeTransactions.reduce((sum,transaction)=>sum+transaction.amount,0);

        //get expense transactions of last 60 days
        const last60daysExpenseTransactions = await Expense.find({
            userId,
            date : {$gte : new Date(Date.now() - 60*24*60*60*1000)},
        }).sort({date : -1});

        //get totalExpense of last 60 days
        const last60daysExpense = last60daysExpenseTransactions.reduce((sum,transaction)=>sum+transaction.amount,0);

        //fetch last 5 transactions(both inc and exp)
        const lastTransactions = [
            ...(await Income.find({userId}).sort({date : -1}).limit(5)).map((txn) => ({
                ...txn.toObject(),
                type : "income"
            })
            ),
            ...(await Expense.find({userId}).sort({date : -1}).limit(5)).map((txn)=>({
                ...txn.toObject(),
                type : "expense"
            })
            ),
        ].sort((a,b) => b.date - a.date);

        //Final Response
        res.json({
            totalBalance : (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome : totalIncome[0]?.total || 0,
            totalExpense : totalExpense[0]?.total || 0,
            last60daysExpenses : {
                total : last60daysExpense,
                transactions : last60daysExpenseTransactions,
            },
            last60DaysIncomes : {
                total : last60daysIncome,
                transactions : last60daysIncomeTransactions,
            },
            recentTransactions : lastTransactions,
        });
    }catch(err){
        res.status(500).json({message : "Server Error",err});
    }
}