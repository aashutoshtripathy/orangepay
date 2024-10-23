import React from 'react'
import CancellationHistory from './CancellationHistory'

const CancellationHistoryyy = () => {
    const userId = localStorage.getItem('userId')
  return (
    <div>
      <CancellationHistory userId={userId}/>
    </div>
  )
}

export default CancellationHistoryyy
