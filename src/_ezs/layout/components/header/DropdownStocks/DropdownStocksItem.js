import { CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'

const DropdownStocksItem = ({ item, selected }) => {
  return (
    <div
      className={clsx(
        'flex items-center px-5 py-3 text-sm hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray',
        selected
          ? 'bg-[#F4F6FA] text-primary dark:text-primary dark:bg-dark-light'
          : 'text-site-color'
      )}
    >
      <div className="flex-1 truncate">{item?.Title}</div>
      {selected && (
        <div className="flex justify-end w-8">
          <CheckIcon className="w-4 text-current" />
        </div>
      )}
    </div>
  )
}

export { DropdownStocksItem }
