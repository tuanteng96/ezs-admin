import clsx from 'clsx'
import React from 'react'

const NotificationDrawerTab = ({ selected, icon, title, count }) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center px-4 py-4 cursor-pointer transition group',
        selected
          ? 'text-primary'
          : 'text-gray-700 dark:text-graydark-800 hover:text-primary dark:hover:text-primary'
      )}
    >
      <div
        className={clsx(
          'w-[50px] h-[50px] rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition relative',
          selected
            ? 'bg-primary text-white'
            : 'bg-[#F3F6F9] text-[#878c93] dark:bg-dark-light dark:text-graydark-800'
        )}
      >
        {icon}
        {count > 0 && (
          <div className="absolute flex items-center justify-center h-5 px-2 text-xs text-white border border-white rounded-full shadow-lg dark:border-dark-separator font-inter bg-danger -top-2 -right-1">
            {count}
          </div>
        )}
      </div>
      <div className="mt-2 font-medium transition text-[13px] leading-5 text-center">
        {title}
      </div>
    </div>
  )
}

export { NotificationDrawerTab }
