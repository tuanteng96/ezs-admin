import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Tooltip from 'rc-tooltip'
import React, { createRef, useEffect, useRef } from 'react'
import TimeField from 'react-simple-timefield'
import { useDimensions } from 'src/_ezs/hooks/useDimensions'

const fnGetTime = () => {
  let arr = []
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 4; j++) {
      arr.push({
        label: `${i < 10 ? '0' + i : i}:${
          j === 0 ? `00` : 5 * j < 10 ? '0' + 5 * j : 5 * j
        }`,
        value: `${i}:${j === 0 ? `00` : 5 * j < 10 ? '0' + 5 * j : 5 * j}`,
        id: `${i}-${j === 0 ? `00` : 5 * j < 10 ? '0' + 5 * j : 5 * j}`
      })
    }
  }
  return arr
}

const InputTimePicker = ({
  errorMessage,
  errorMessageForce,
  value,
  onChange,
  ...props
}) => {
  const componentRef = useRef()
  const ListTime = fnGetTime()
  const { width } = useDimensions(componentRef)

  const refs = ListTime.reduce((acc, value) => {
    acc[value.id] = createRef()
    return acc
  }, {})

  useEffect(() => {
    const index = ListTime.findIndex(x => x.value === value)
    if (index > 1) {
      refs[ListTime[index].id]?.current?.scrollIntoView()
    }
  }, [value, ListTime, refs])

  return (
    <>
      <div className="relative">
        <Tooltip
          // visible={true}
          afterVisibleChange={() => {
            const index = ListTime.findIndex(x => x.value === value)
            if (index > 1) {
              refs[ListTime[index].id]?.current?.scrollIntoView()
            }
          }}
          overlayClassName="text-white dark:text-dark-light"
          placement={['bottom']}
          trigger={['focus']}
          overlay={
            <div
              style={{ width: width || 0 + 'px' }}
              className="py-2.5 bg-white dark:bg-dark-light rounded-sm shadow-lg text-gray-700 dark:text-graydark-800 h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-graydark-400 scrollbar-track-transparent scrollbar-thumb-rounded"
            >
              {ListTime &&
                ListTime.map((item, index) => (
                  <div
                    onClick={() => onChange(item.value)}
                    key={index}
                    className={clsx(
                      'flex items-center px-5 py-2 text-[15px] font-medium hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary',
                      item.value === value
                        ? 'bg-primarylight text-primary'
                        : 'dark:text-dark-gray text-site-color'
                    )}
                    ref={refs[item.id]}
                  >
                    {item.label}
                  </div>
                ))}
            </div>
          }
          showArrow={false}
          align={{
            offset: [0]
          }}
        >
          <div ref={componentRef}>
            <TimeField
              //showSeconds
              value={value}
              className={clsx(
                '!w-full px-5 py-3 font-medium text-gray-700 transition bg-white autofill:bg-white border rounded outline-none dark:bg-site-aside disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:text-graydark-700',
                errorMessageForce
                  ? 'border-danger'
                  : 'border-gray-300 dark:border-graydark-400 focus:border-primary dark:focus:border-primary'
              )}
              autoComplete="off"
              {...props}
            />
          </div>
        </Tooltip>
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

export { InputTimePicker }
