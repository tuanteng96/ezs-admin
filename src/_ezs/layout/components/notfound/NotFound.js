import React from 'react'

const NotFound = ({ Title, Desc }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded shadow-sm dark:bg-dark-aside">
      <svg
        className="w-16"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <g fill="none" fillRule="evenodd">
          <path fill="#FBD74C" d="M27 11h16v34H27z" />
          <path
            d="M28.5 4C42.031 4 53 14.969 53 28.5a24.413 24.413 0 01-6.508 16.63c.041.022.082.05.12.08l.095.083 14 14a1 1 0 01-1.32 1.497l-.094-.083-14-14a1 1 0 01-.164-.216A24.404 24.404 0 0128.5 53C14.969 53 4 42.031 4 28.5S14.969 4 28.5 4zm0 2C16.074 6 6 16.074 6 28.5S16.074 51 28.5 51 51 40.926 51 28.5 40.926 6 28.5 6zM39 14a1 1 0 011 1v26a1 1 0 01-1 1H17a1 1 0 01-1-1V15a1 1 0 011-1zm-1 2H18v24h20V16zm-3 16a1 1 0 01.117 1.993L35 34H21a1 1 0 01-.117-1.993L21 32h14zm0-12a1 1 0 011 1v7a1 1 0 01-1 1H21a1 1 0 01-1-1v-7a1 1 0 011-1zm-1 2H22v5h12v-5z"
            fill="#101928"
            fillRule="nonzero"
          />
        </g>
      </svg>
      <div className="mt-4 mb-1 text-xl font-semibold dark:text-graydark-800">
        {Title}
      </div>
      <div className="text-base text-muted">{Desc}</div>
    </div>
  )
}

export { NotFound }
