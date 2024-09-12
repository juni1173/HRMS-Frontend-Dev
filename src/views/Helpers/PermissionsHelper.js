import React from 'react'

const PermissionsHelper = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const user_role = userData.user_role
  return (
        user_role
  )
}

export default PermissionsHelper