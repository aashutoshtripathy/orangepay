import React from 'react'
import TopupReport from './TopupReport'

const WalletReportt = () => {


    const userId = localStorage.getItem('userId')

  return (
    <div>
      <TopupReport userId={userId} />
    </div>
  )
}

export default WalletReportt
