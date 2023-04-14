import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React, { Fragment } from 'react'

const ListMethod = [
  {
    value: 0,
    label: 'Cùng cấp - Chia đều, Khác cấp - Chia theo người cao nhất'
  },
  {
    value: 1,
    label: 'Cùng cấp - Chia đều, Khác cấp - Theo từng người'
  }
]

const OsSalaryMethod = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Listbox
        value={ListMethod.filter(x => x.value === value)[0]}
        onChange={val => onChange(val.value)}
      >
        <Listbox.Button className="text-gray-800 dark:text-graydark-800 font-semibold text-[15px] pl-3 cursor-pointer flex">
          Phương thức tính lương tự động
          <ChevronDownIcon className="w-4 ml-1 mt-1" />
        </Listbox.Button>
        <Listbox.Options className="z-[1001] rounded px-0 py-2 border-0 max-full w-full bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow absolute right-0 bottom-full">
          {ListMethod.map((otp, index) => (
            <Listbox.Option key={index} value={otp} as={Fragment}>
              {({ selected }) => (
                <div
                  className={clsx(
                    'flex items-center px-4 py-3 text-[15px] hover:bg-light dark:hover:bg-dark-light hover:text-primary transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium',
                    selected &&
                      'text-primary bg-light dark:text-primary dark:bg-dark-light'
                  )}
                >
                  {otp.label}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}

export { OsSalaryMethod }
