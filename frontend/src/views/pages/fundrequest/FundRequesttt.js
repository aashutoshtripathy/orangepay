import React from 'react'
import FundRequest from './FundRequest'

const FundRequesttt = () => {

    const userId = localStorage.getItem('userId')


  return (
    <div>
      <FundRequest userId={userId}/>
    </div>
  )
}

export default FundRequesttt
