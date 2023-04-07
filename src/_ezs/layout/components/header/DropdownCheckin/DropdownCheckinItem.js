import React from 'react'
import PropTypes from 'prop-types'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { formatString } from 'src/_ezs/utils/formatString'
import { Link } from 'react-router-dom'

import moment from 'moment'
import 'moment/locale/vi'

moment.locale('vi')

const DropdownCheckinItem = ({ member }) => {
  return (
    <Link
      to={'/clients/' + member?.ID}
      className="flex pb-5 mb-5 border-b border-dashed border-separator dark:border-dark-separator last:mb-0 last:pb-0 last:border-0"
    >
      <div className="flex items-center justify-center w-12 h-12 font-bold uppercase rounded font-inter bg-primarylight dark:bg-dark-primarylight text-primary">
        {formatString.getLastFirst(member.FullName)}
      </div>
      <div className="px-3.5 grow">
        <div className="mb-px font-semibold capitalize truncate dark:text-graydark-800 font-inter">
          {member.FullName}
        </div>
        <div className="text-sm font-medium text-gray-700 text-dark dark:text-graydark-800">
          <span>{member.MobilePhone}</span>
          <span className="px-1">-</span>
          <span>
            Check In lúc
            <span className="pl-1 font-semibold text-danger">
              {moment(member?.CheckIn?.CreateDate).format('HH:mm')}
            </span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end w-24">
        <button
          className="flex items-center justify-center w-10 h-10 ml-2 rounded-full bg-light text-lightinverse dark:bg-dark-light transiton dark:hover:bg-dark-primarylight hover:text-primary"
          type="button"
        >
          <ArrowRightIcon className="w-5" />
        </button>
      </div>
    </Link>
  )
}

DropdownCheckinItem.propTypes = {
  member: PropTypes.object
}

export { DropdownCheckinItem }
