import React from 'react'
import OrangePayReport from './OrangePayReport'

const OrangePayReportt = () => {
    const userId = localStorage.getItem('userId')
  return (
    <div>
      <OrangePayReport userId={userId}/>
    </div>
  )
}

export default OrangePayReportt
