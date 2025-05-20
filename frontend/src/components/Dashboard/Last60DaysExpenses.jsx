import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last60DaysExpenses = ({data}) => {
  const [chartData, setChartData] = useState([]);
  useEffect(()=>{
    const result = prepareExpenseBarChartData(data);
    setChartData(result);
    return () =>{};
  },[data])
  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg text-black dark:text-gray-300'>Last 60 Days Expenses</h5>
      </div>

      <CustomBarChart data = {chartData}/>
    </div>
  )
}

export default Last60DaysExpenses;