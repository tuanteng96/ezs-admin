import clsx from 'clsx'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const AsideMenuItem = ({ to, title, icon, actives }) => {
  const { pathname } = useLocation()
  const hasActive = actives && actives.some(x => pathname.includes(x))
  return (
    <Tooltip
      overlayClassName="text-white dark:text-dark-light"
      placement="right"
      trigger={['hover']}
      overlay={
        <div className="px-3 py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800">
          {title}
        </div>
      }
      align={{
        offset: [9, 0]
      }}
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          clsx(
            'flex items-center justify-center w-12 h-12 mb-3 rounded-md transition',
            isActive || hasActive ? 'bg-primary' : 'hover:bg-site-aside-hover'
          )
        }
      >
        {icon()}
      </NavLink>
    </Tooltip>
  )
}

export { AsideMenuItem }
