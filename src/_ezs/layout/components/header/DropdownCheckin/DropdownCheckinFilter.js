import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { InputSolid } from 'src/_ezs/partials/forms'
import clsx from 'clsx'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const options = [
  {
    value: '',
    label: 'Tất cả'
  },
  {
    value: 1,
    label: 'Phát sinh đơn hàng'
  },
  {
    value: 0,
    label: 'Không phát sinh đơn hàng'
  }
]

const DropdownCheckinFilter = ({
  onChangeInput,
  onChangeType,
  valueText,
  valueOption
}) => {
  return (
    <div className="flex px-6 py-4 border-b border-separator dark:border-dark-separator">
      <div className="flex-1">
        <InputSolid
          value={valueText}
          type="text"
          onChange={e => onChangeInput(e.target.value)}
          placeholder="Nhập tên khách hàng"
        />
      </div>
      <Listbox value={valueOption} onChange={val => onChangeType(val)}>
        <div className="relative w-48 pl-3">
          <Listbox.Button
            type="button"
            className="flex items-center w-full px-5 py-3 font-medium text-gray-700 transition bg-gray-100 border border-gray-100 rounded outline-none dark:bg-graydark-100 focus:bg-gray-200 disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:bg-graydark-200 dark:focus:bg-graydark-200 dark:text-graydark-700 dark:border-graydark-100 focus:border-gray-200 dark:focus:border-graydark-200"
          >
            <span className="block w-[135px] text-left truncate">
              {valueOption ? valueOption.label : 'Chọn loại'}
            </span>
            <ChevronDownIcon className="w-3.5 ml-2" />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-[1001] absolute rounded px-0 py-2 border-0 max-w-[200px] w-full bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
              {options.map((item, index) => (
                <Listbox.Option key={index} value={item}>
                  {({ selected }) => (
                    <div
                      className={clsx(
                        'flex items-center px-5 py-3 text-sm hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray',
                        selected
                          ? 'bg-[#F4F6FA] text-primary dark:text-primary dark:bg-dark-light'
                          : 'text-site-color'
                      )}
                    >
                      <div className="flex-1 truncate">{item?.label}</div>
                      {selected && (
                        <div className="flex justify-end w-8">
                          <CheckIcon className="w-4 text-current" />
                        </div>
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

DropdownCheckinFilter.propTypes = {
  onChangeInput: PropTypes.func,
  valueText: PropTypes.string,
  onChangeType: PropTypes.func,
  valueType: PropTypes.string
}

export { DropdownCheckinFilter }
