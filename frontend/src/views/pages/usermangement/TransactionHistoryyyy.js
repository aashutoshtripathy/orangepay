import React from 'react'
import TransactionHistory from './TransactionHistory';

const TransactionHistoryyyy = () => {

    const userId = localStorage.getItem('userId')

  return (
    <div>
      <TransactionHistory userId={userId}/>
    </div>
  )
}

export default TransactionHistoryyyy
