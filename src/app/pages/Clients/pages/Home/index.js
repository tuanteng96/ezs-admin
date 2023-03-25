import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function ClientList(props) {
  const { pathname } = useLocation()

  return (
    <div>
      <input type="text" />
      <Link to="/clients/add" state={{ previousPath: pathname }}>
        Add
      </Link>
      <div>Home Member</div>
    </div>
  )
}

export default ClientList
