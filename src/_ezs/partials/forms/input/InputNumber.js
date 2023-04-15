import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React from 'react'
import { NumericFormat } from 'react-number-format'

const InputNumber = ({
  errorMessage,
  errorMessageForce,
  className = 'px-5 py-3 font-medium',
  ...props
}) => {
  return (
    <>
      <div className="relative">
        <NumericFormat
          type="text"
          className={clsx(
            'w-full text-gray-700 transition bg-white autofill:bg-white border rounded outline-none dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700',
            className,
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

export { InputNumber }
