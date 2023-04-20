import clsx from 'clsx'
import React, { Fragment, useState } from 'react'
import { useAuth } from 'src/_ezs/core/Auth'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import { formatString } from 'src/_ezs/utils/formatString'

const Avatar = ({ classes, bgStatus }) => {
  const [imageError, setImageError] = useState(false)
  const { auth } = useAuth()
  return (
    <Fragment>
      {auth?.User?.Avatar && (
        <div className="relative cursor-pointer">
          {!imageError && (
            <img
              className={clsx(
                'rounded shadow-lg object-cover',
                classes && classes
              )}
              src={toAbsolutePath(auth?.User?.Avatar)}
              alt={auth?.User?.FullName}
              onError={() => setImageError(true)}
            />
          )}
          {imageError && (
            <div
              className={clsx(
                'flex items-center justify-center text-xl font-bold rounded cursor-pointer bg-primarylight text-primary',
                classes && classes
              )}
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {bgStatus && (
            <span
              className={clsx(
                'absolute top-0 left-9 transform -translate-y-1/2 w-3 h-3 border border-white dark:border-gray-800 rounded-full',
                bgStatus && bgStatus
              )}
            ></span>
          )}
        </div>
      )}
      {!auth?.User?.Avatar && (
        <div
          className={clsx(
            'flex items-center justify-center font-bold rounded cursor-pointer bg-primarylight text-primary font-inter uppercase',
            classes && classes
          )}
        >
          {formatString.getLastFirst(auth?.User?.FullName)}
        </div>
      )}
    </Fragment>
  )
}

export { Avatar }
