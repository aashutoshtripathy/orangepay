import React from 'react'
import WalletReport from './WalletReport'

const WalletReportt = () => {


    const userId = localStorage.getItem('userId')

  return (
    <div>
      <WalletReport userId={userId} />
    </div>
  )
}

export default WalletReportt
