import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'

const Input = ({ errorMessage, errorMessageForce, className, ...props }) => {
  return (
    <>
      <div className="relative">
        <input
          type="text"
          className={clsx(
            'w-full px-5 py-3 font-medium text-gray-700 transition bg-white autofill:bg-white border rounded outline-none dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700',
            className && className,
            errorMessageForce
              ? 'border-danger'
              : 'border-gray-300 dark:border-graydark-400 focus:border-primary dark:focus:border-primary'
          )}
          autoComplete="off"
          {...props}
        />
        {errorMessageForce && (
          <div className="absolute top-0 right-0 flex items-center w-10 h-full pointer-events-none">
            <ExclamationCircleIcon className="w-6 text-danger" />
          </div>
        )}
      </div>
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </>
  )
}

export { Input }
