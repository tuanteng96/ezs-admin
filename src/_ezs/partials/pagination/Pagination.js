import React from 'react'
import clsx from 'clsx'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const RANGE = 1

function Pagination({ pageCount, pageOffset = 1, pageSizes = 15, onChange }) {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = index => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span
            key={index}
            className="w-9 h-9 flex justify-center items-center font-medium"
          >
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = index => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span
            key={index}
            className="w-9 h-9 flex justify-center items-center font-medium"
          >
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageCount)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (
          pageOffset <= RANGE * 2 + 1 &&
          pageNumber > pageOffset + RANGE &&
          pageNumber < pageCount - RANGE + 1
        ) {
          return renderDotAfter(index)
        } else if (
          pageOffset > RANGE * 2 + 1 &&
          pageOffset < pageCount - RANGE * 2
        ) {
          if (pageNumber < pageOffset - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (
            pageNumber > pageOffset + RANGE &&
            pageNumber < pageCount - RANGE + 1
          ) {
            return renderDotAfter(index)
          }
        } else if (
          pageOffset >= pageCount - RANGE * 2 &&
          pageNumber > RANGE &&
          pageNumber < pageOffset - RANGE
        ) {
          return renderDotBefore(index)
        }

        return (
          <div
            key={index}
            className={clsx(
              'w-9 h-9 flex justify-center items-center font-medium rounded font-inter border cursor-pointer mx-[2px]',
              pageNumber === pageOffset
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-gray-300 hover:bg-gray-200 dark:bg-dark-light dark:hover:bg-primary dark:hover:border-primary dark:border-graydark-200 dark:text-white'
            )}
            onClick={() =>
              onChange({ pageIndex: pageNumber, pageSize: pageSizes })
            }
          >
            {pageNumber}
          </div>
        )
      })
  }

  return (
    <div className="flex flex-wrap justify-center">
      <span
        className={clsx(
          'w-9 h-9 flex justify-center items-center font-medium rounded font-inter bg-white border border-gray-300 hover:bg-gray-200 mr-[2px] dark:bg-dark-light dark:border-graydark-200 dark:text-white',
          pageOffset === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
        onClick={() =>
          pageOffset > 1 &&
          onChange({ pageIndex: pageOffset - 1, pageSize: pageSizes })
        }
      >
        <ChevronLeftIcon className="w-4" />
      </span>
      {renderPagination()}
      <span
        className={clsx(
          'w-9 h-9 flex justify-center items-center font-medium rounded font-inter bg-white border border-gray-300 hover:bg-gray-200 cursor-pointer ml-[2px] dark:bg-dark-light dark:border-graydark-200 dark:text-white',
          pageOffset === pageCount
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer'
        )}
        onClick={() =>
          pageOffset !== pageCount &&
          onChange({ pageIndex: pageOffset + 1, pageSize: pageSizes })
        }
      >
        <ChevronRightIcon className="w-4" />
      </span>
    </div>
  )
}

export default Pagination
