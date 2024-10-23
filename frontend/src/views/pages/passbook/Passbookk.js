import React from 'react'
import Passbook from './Passbook'

const Passbookk = () => {

    const userId = localStorage.getItem('userId')

  return (
    <div>
      <Passbook userId={userId}/>
    </div>
  )
}

export default Passbookk
