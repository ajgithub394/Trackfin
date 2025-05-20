import React from 'react'

const CustomTooltip = ({active, payload}) => {
  if(active && payload && payload.length){
    return (
        <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-300 dark:border-gray-700'>
            <p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].name}</p>
            <p className='text-sm text-gray-600'>
                Amount : <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>₹{payload[0].value}</span>
            </p>
        </div>
    )
  }
  return null;
}

export default CustomTooltip