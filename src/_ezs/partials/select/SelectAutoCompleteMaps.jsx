import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import MoresAPI from 'src/_ezs/api/mores.api'
import useDebounceKey from 'src/_ezs/hooks/useDebounceKey'

function SelectAutoCompleteMaps({
  errorMessage,
  errorMessageForce,
  className,
  wrapClass,
  value,
  onChange,
  onUpdate,
  ...props
}) {
  let [loading, setLoading] = useState(false)
  let [Lists, setLists] = useState([])

  let inputRef = useRef()

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        if (Lists.length > 0) {
          setLists([])
        }
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef, Lists])

  const onSearchMaps = val => {
    MoresAPI.actionUrl({
      url: 'https://maps.vietmap.vn/api/autocomplete/v3',
      headers: {},
      param: {
        //"key1": "{key1}"
        apikey: '{KEY_API_VIETMAP}',
        text: val
      },
      method: 'GET', //"GET / POST",
      include: 'ENV',
      body: {},
      resultType: 'json'
    }).then(({ data }) => {
      setLoading(false)
      setLists(data?.result || [])
    })
  }

  const debounce = useDebounceKey(onSearchMaps, 1500)

  const onClick = item => {
    setLists([])
    onChange(item.display)
    onUpdate && onUpdate(item)
  }

  return (
    <div>
      <div className={clsx('relative', wrapClass)} ref={inputRef}>
        <input
          {...props}
          type="text"
          className={clsx(
            'w-full px-3.5 py-3 placeholder:font-normal font-medium text-gray-800 transition bg-white autofill:bg-white border rounded outline-none dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700',
            className && className,
            errorMessageForce
              ? 'border-danger'
              : 'border-gray-300 dark:border-graydark-400 focus:border-primary dark:focus:border-primary'
          )}
          autoComplete="off"
          value={value}
          onChange={e => {
            onChange(e.target.value)
            if (e.target.value) {
              setLoading(true)
              debounce(e.target.value, 1000)
            } else {
              setLoading(false)
              setLists([])
            }
          }}
        />
        {errorMessageForce && (
          <div className="absolute top-0 right-0 flex items-center w-10 h-full pointer-events-none">
            <ExclamationCircleIcon className="w-6 text-danger" />
          </div>
        )}
        {loading && (
          <div className="absolute top-0 right-0 flex items-center w-10 h-full pointer-events-none">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin fill-primary"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {!loading && Lists.length > 0 && (
          <div className="absolute z-10 w-full py-2 mt-2 bg-white rounded shadow-lg max-h-[250px] overflow-auto">
            {Lists.map((item, index) => (
              <div
                onClick={() => onClick(item)}
                className="px-3 py-2 cursor-pointer font-number hover:bg-[#f4f6fa] transition-all hover:text-primary"
                key={index}
              >
                <div className="mb-px font-medium">{item.name}</div>
                <div className="text-muted2">{item.address}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectAutoCompleteMaps }
