import React, { Fragment, useMemo } from 'react'
import { Button } from 'src/_ezs/partials/button'
import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsVerticalIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import useQueryParams from 'src/_ezs/hooks/useQueryParams'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useQuery } from '@tanstack/react-query'
import { formatString } from 'src/_ezs/utils/formatString'

function Products(props) {
  const queryParams = useQueryParams()

  const queryConfig = {
    pi: queryParams.pi || 1,
    ps: queryParams.ps || 15,
    key: queryParams.key || '',
    types: queryParams.types || 794,
    serviceOrFee: 0
  }

  const { data, isLoading } = useQuery({
    queryKey: ['ListProducts', queryConfig],
    queryFn: () => ProdsAPI.getListProds(queryConfig)
  })

  console.log(data)

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'ID',
        dataKey: 'ID',
        width: 100,
        sortable: false
      },
      {
        key: 'TypeText',
        title: 'Hình ảnh',
        dataKey: 'TypeText',
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <div className="border border-separator">
              <svg
                className="w-20 h-20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 1000"
              >
                <path fill="#fff" d="M0 0h1000v1000H0z" />
                <g opacity=".1">
                  <path d="M566.64 267.54V237.6c0-6.74-5.46-12.2-12.2-12.2h-5.37v-68.2c0-6.74-5.46-12.2-12.2-12.2h-73.72c-6.74 0-12.2 5.46-12.2 12.2v68.18h-5.37c-6.74 0-12.2 5.46-12.2 12.2v29.94c-43.58 4.54-76.71 41.22-76.81 85.03v490.23c0 6.74 5.46 12.21 12.2 12.21h262.49c6.74 0 12.2-5.46 12.2-12.2V352.56c-.11-43.81-33.24-80.49-76.82-85.02zM500 166.48c15.23 0 27.58 12.35 27.58 27.58 0 15.23-12.35 27.58-27.58 27.58-15.23 0-27.58-12.35-27.58-27.58 0-15.23 12.35-27.58 27.58-27.58zm-42.23 83.32h84.46v17.33h-84.46V249.8zm161.27 580.79H380.96V352.56c.04-33.68 27.34-60.98 61.02-61.02h116.03c33.68.04 60.98 27.34 61.02 61.02v478.03z" />
                  <path d="M419.04 406.1c-6.74 0-12.2 5.46-12.2 12.2v263.14c0 6.74 5.46 12.2 12.2 12.2s12.2-5.46 12.2-12.2V418.31c.01-6.74-5.46-12.21-12.2-12.21z" />
                </g>
              </svg>
            </div>
          </div>
        ),
        width: 115,
        sortable: false
        //align: 'center',
      },
      {
        key: 'DynamicID',
        title: 'Mã sản phẩm',
        dataKey: 'DynamicID',
        width: 150,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Tên sản phẩm',
        dataKey: 'Title',
        width: 300,
        cellRenderer: ({ rowData }) => <div>{rowData.Title}</div>,
        sortable: false
      },
      {
        key: 'TypeName',
        title: 'Phân loại',
        dataKey: 'TypeName',
        width: 250,
        cellRenderer: ({ rowData }) => <div>{rowData.TypeName}</div>,
        sortable: false
      },
      {
        key: 'NAP_QUY1',
        title: 'Giá bán',
        dataKey: 'NAP_QUY1',
        width: 180,
        cellRenderer: ({ rowData }) => (
          <div>{formatString.formatVND(rowData?.PriceProduct)}</div>
        ),
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return (
    <div className="flex flex-col h-full max-w-6xl p-10 mx-auto">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-3xl font-extrabold">Quản lý sản phẩm</div>
          <div className="mt-1.5">
            Thêm và quản lý sản phẩm của bạn trong kho
          </div>
        </div>
        <div className="flex pb-1">
          <Menu as="div" className="relative mr-2.5">
            <div>
              <Menu.Button className="flex items-center px-3.5 font-semibold border border-gray-300 hover:border-gray-700 transition rounded h-[50px]">
                Tùy chọn
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="z-[1001] absolute rounded px-0 py-2 border-0 w-[220px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow">
                <div>
                  <Menu.Item>
                    <button className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray">
                      Tải lên Excel
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray">
                      Tải xuống Excel
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray">
                      Quản lý danh mục
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button className="w-full text-[15px] flex items-center px-5 py-3 hover:bg-[#F4F6FA] dark:hover:bg-dark-light hover:text-primary font-inter transition cursor-pointer dark:hover:text-primary dark:text-dark-gray">
                      Quản lý nhãn hàng
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Button className="relative flex items-center h-[50px] px-4 font-semibold text-white transition rounded shadow-lg bg-success hover:bg-success focus:outline-none focus:shadow-none disabled:opacity-70">
            Thêm mới sản phẩm
          </Button>
        </div>
      </div>
      {/* <div className="bg-[#f8f8fb] p-4 flex justify-between rounded-lg my-5">
        <div className="w-[500px] relative">
          <MagnifyingGlassIcon className="absolute w-5 pointer-events-none left-4 top-2/4 -translate-y-2/4" />
          <input
            className="w-full py-2.5 font-semibold border border-gray-300 rounded-3xl pl-12"
            type="text"
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <button
          className="flex items-center px-5 py-2.5 font-semibold bg-white border border-gray-300 rounded-3xl"
          type="button"
        >
          Bộ lọc
          <AdjustmentsVerticalIcon className="w-6 ml-1.5" />
        </button>
      </div> */}
      <ReactBaseTable
        wrapClassName="grow"
        rowKey="ID"
        columns={columns}
        data={data?.data?.list || []}
        estimatedRowHeight={80}
        emptyRenderer={
          <div className="flex items-center justify-center h-full">
            Không có dữ liệu
          </div>
        }
        loading={isLoading}
      />
    </div>
  )
}

export default Products
