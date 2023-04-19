import React, { useRef, useCallback } from 'react'
import { PrinterIcon } from '@heroicons/react/24/outline'
import ReactToPrint from 'react-to-print'
import { PrinterOs } from 'src/_ezs/partials/printer'

const pagePrintStyle = `
  @media print and (width: 21cm) and (height: 29.7cm) {
     @page {
        margin: 25px !important;
     }
  } 
  @page {
    size: auto;
  }
  @media print {
    html,
    body {
      height: initial!important;
      overflow: initial!important;
    }
  }
`

const OsPrint = props => {
  const componentRef = useRef(null)
  const onBeforeGetContentResolve = useRef(null)
  const btnRef = useRef(null)
  const handleOnBeforeGetContent = useCallback(() => {
    console.log('`onBeforeGetContent` called')
    return new Promise(resolve => {
      onBeforeGetContentResolve.current = resolve
      resolve()
    })
  }, [])

  const reactToPrintTrigger = useCallback(() => {
    return (
      <button
        ref={btnRef}
        type="button"
        className="relative flex items-center justify-center h-12 px-4 ml-2 font-bold text-gray-900 transition border border-gray-400 rounded dark:text-white hover:border-gray-900 dark:hover:border-white focus:outline-none focus:shadow-none disabled:opacity-70"
      >
        <PrinterIcon className="w-5" />
      </button>
    )
  }, [])

  const handleBeforePrint = useCallback(() => {
    console.log('`onBeforePrint` called')
  }, [])

  const handleAfterPrint = useCallback(() => {
    console.log('`onAfterPrint` called')
  }, [])

  //Effect Printer btnRef.current.click()
  return (
    <>
      <ReactToPrint
        documentTitle="Hóa đơn dịch vụ"
        trigger={reactToPrintTrigger}
        content={() => componentRef.current}
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        pageStyle={pagePrintStyle}
      />
      <div className="hidden">
        <PrinterOs ref={componentRef} />
      </div>
    </>
  )
}

export { OsPrint }
