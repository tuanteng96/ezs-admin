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
  wrapClasName,
  className,
  value,
  valueText,
  iconClassName,
  onChange,
  ...props
}) => {
  return (
    <Popover className={clsx('relative', wrapClasName && wrapClasName)}>
      {({ open }) => (
        <>
          <Popover.Button className={className}>
            {valueText || moment(value).format('dd, D MMMM, YYYY')}
            <ChevronDownIcon
              className={clsx(
                iconClassName,
                open ? 'rotate-180 transform' : ''
              )}
            />
          </Popover.Button>
          <Popover.Panel className="z-10 absolute pt-2.5 top-full">
            {({ close }) => (
              <DatePicker
                onChange={date => {
                  onChange(date, close)
                }}
                inline
                {...props}
              />
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}

InputDatePickerInline.propTypes = {
  ClassName: PropTypes.string,
  iconClassName: PropTypes.string
}

export { InputDatePickerInline }
