import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'

const InputTextareaSolid = ({
  className,
  errorMessage,
  errorMessageForce,
  ...props
}) => {
  return (
    <>
      <div className="relative">
        <textarea
          type="text"
          className={clsx(
            'w-full px-5 py-3 font-medium text-gray-700 transition bg-gray-100 border rounded outline-none dark:bg-graydark-100 focus:bg-gray-200 disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:focus:bg-graydark-200 dark:text-graydark-700',
            className && className,
            errorMessageForce
              ? 'border-danger'
              : 'border-gray-100 dark:border-graydark-100 focus:border-gray-200 dark:focus:border-graydark-200'
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

export { InputTextareaSolid }
