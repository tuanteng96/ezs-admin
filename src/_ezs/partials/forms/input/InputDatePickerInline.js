import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Popover } from '@headlessui/react'
import clsx from 'clsx'
import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const InputDatePickerInline = ({
  className,
  value,
  iconClassName,
  onChange
}) => {
  return (
    <div className="relative z-[100]">
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button className={className}>
              {moment(value).format('dd, D MMMM, YYYY')}
              <ChevronDownIcon
                className={clsx(
                  iconClassName,
                  open ? 'rotate-180 transform' : ''
                )}
              />
            </Popover.Button>
            <Popover.Panel className="absolute pt-2.5 top-full">
              {({ close }) => (
                <DatePicker
                  selected={value}
                  onChange={date => {
                    onChange(date)
                    close()
                  }}
                  inline
                />
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  )
}

InputDatePickerInline.propTypes = {
  ClassName: PropTypes.string,
  iconClassName: PropTypes.string
}

export { InputDatePickerInline }
