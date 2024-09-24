import React, { Fragment, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Table, { AutoResizer } from 'react-base-table'
import Text from 'react-texty'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import Pagination from '../pagination'
import { Menu, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import 'src/_ezs/assets/plugin/react-base-table/react-base-table.css'

ReactBaseTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool
}

const sizePerPage = [15, 30, 50, 100, 500, 1000]

function ReactBaseTable({
  columns,
  data,
  onPagesChange,
  loading,
  isPreviousData,
  pageCount,
  pageOffset,
  pageSizes,
  rowKey,
  rowRenderer,
  components,
  wrapClassName,
  emptyRenderer,
  onChange,
  pagination,
  paginationClassName = 'flex items-center justify-between w-full mt-4',
  ...props
}) {
  const tableRef = useRef(null)

  useEffect(() => {
    tableRef?.current?.scrollToRow(0, 'start')
  }, [pageOffset])

  const TableCell = ({ className, cellData }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {cellData}
    </Text>
  )

  const TableHeaderCell = ({ className, column }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {column.title}
    </Text>
  )

  return (
    <>
      <div className={clsx(wrapClassName)}>
        <AutoResizer>
          {({ width, height }) => (
            <Table
              fixed
              {...props}
              ref={tableRef}
              rowKey={rowKey}
              width={width}
              height={height}
              columns={columns}
              data={data}
              overlayRenderer={() => (
                <LoadingComponentFull
                  bgClassName={clsx(
                    'bg-white dark:bg-dark-aside',
                    isPreviousData && 'bg-opacity-70'
                  )}
                  top="top-[50px]"
                  height="h-[calc(100%-50px)]"
                  loading={loading}
                />
              )}
              emptyRenderer={() =>
                !loading && (
                  <>
                    {emptyRenderer ? (
                      <>{emptyRenderer()}</>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full dark:bg-dark-aside">
                        <img
                          className="w-auto max-h-full max-w-[350px]"
                          src={toAbsoluteUrl('/assets/svg/sketchy/4.png')}
                          alt="EZS - Phần mềm quản lý Spa"
                        />
                      </div>
                    )}
                  </>
                )
              }
              rowRenderer={rowRenderer}
              components={{ TableCell, TableHeaderCell, ...components }}
              ignoreFunctionInColumnCompare={false}
            />
          )}
        </AutoResizer>
      </div>
      {pagination && (
        <div className={paginationClassName}>
          <div className="flex">
            <span className="hidden md:inline-block">Hiển thị</span>
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex items-center px-2 font-semibold font-inter">
                  {pageSizes}
                  <ChevronUpIcon className="w-4 ml-1" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Menu.Items className="z-[1001] bottom-full absolute rounded px-0 py-2 border-0 w-[150px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                  <div>
                    {sizePerPage &&
                      sizePerPage.map((size, index) => (
                        <Menu.Item
                          key={index}
                          onClick={() =>
                            onChange({
                              pageIndex: 1,
                              pageSize: size
                            })
                          }
                        >
                          <button
                            className={clsx(
                              'w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray font-medium',
                              size === pageSizes && 'text-primary bg-[#F4F6FA]'
                            )}
                          >
                            {size}
                          </button>
                        </Menu.Item>
                      ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <span className="hidden md:inline-block">trên trang</span>
          </div>
          <div>
            <Pagination
              pageCount={pageCount}
              pageOffset={pageOffset}
              pageSizes={pageSizes}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ReactBaseTable
