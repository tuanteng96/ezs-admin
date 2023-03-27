import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const Checkbox = ({
  labelText,
  labelClassName = 'pl-2',
  htmlFor,
  className,
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        'flex w-full font-medium text-gray-900 cursor-pointer checkbox dark:text-gray-300',
        className && className
      )}
    >
      <input
        className="absolute opacity-0"
        type="checkbox"
        id={htmlFor}
        {...props}
      />
      <span className="w-5 h-5 bg-[#EBEDF3] dark:bg-dark-light rounded block icon checkbox-primary relative after:absolute after:left-2 after:top-[3px] transition"></span>
      {labelText && <span className={labelClassName}>{labelText}</span>}
    </label>
  )
}

Checkbox.propTypes = {
  labelText: PropTypes.string,
  htmlFor: PropTypes.string,
  className: PropTypes.string
}

export { Checkbox }
