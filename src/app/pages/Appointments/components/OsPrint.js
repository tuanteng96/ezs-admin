import React from 'react'
import { PrinterIcon } from '@heroicons/react/24/outline'
import { useParams } from 'react-router-dom'

const OsPrint = props => {
  const { id } = useParams()
  //Effect Printer btnRef.current.click()
  const onPrinter = () => {
    window.open(
      process.env.REACT_APP_API_URL +
        `/services/printHelder.aspx?osid=${id}&osMode=1`,
      '_blank',
      'toolbar=1, scrollbars=1, resizable=1, width=' + 600 + ', height=' + 926
    )
  }
  return (
    <>
      <button
        onClick={onPrinter}
        type="button"
        className="relative flex items-center justify-center h-12 px-4 ml-2 font-bold text-gray-900 transition border border-gray-400 rounded dark:text-white hover:border-gray-900 dark:hover:border-white focus:outline-none focus:shadow-none disabled:opacity-70"
      >
        <PrinterIcon className="w-5" />
      </button>
    </>
  )
}

export { OsPrint }
