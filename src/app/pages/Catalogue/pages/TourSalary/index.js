import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { useMemo, useState } from 'react'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import { SelectCategories } from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatArray } from 'src/_ezs/utils/formatArray'
import Swal from 'sweetalert2'
import Text from 'react-texty'

const RendererBonusSale = ({ rowData, setDisabled, disabled }) => {
  const [value, setValue] = useState(null)
  const [focus, setFocus] = useState(false)

  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValue(rowData.Bonus)
  }, [rowData])

  const updateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await ProdsAPI.prod24UpdateKPI(body)
      await queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
      return data
    }
  })

  const onSubmit = val => {
    let values = {
      update: [
        {
          ID: rowData.ID,
          Bonus: val || ''
        }
      ]
    }
    if (rowData.filters) {
      values = {
        Bonus: val,
        updatebyFilter: rowData.filters
      }
      Swal.fire({
        customClass: {
          confirmButton: 'bg-success'
        },
        title: 'Xác nhận cập nhật ?',
        html: `Tất cả các sản phẩm được tìm kiếm theo bộ lọc sẽ được cập nhật về loại lương Tour : ${
          val || 0
        } và không thể khôi phục.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Thực hiện',
        cancelButtonText: 'Huỷ',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const data = await updateMutation.mutateAsync(values)
          return data
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
        setValue('')
        setDisabled(false)
        setFocus(false)
        if (result.isConfirmed) {
          window?.top?.toastr?.success('Đã cập nhật tất cả.', '', {
            timeOut: 1500
          })
        }
      })
    } else {
      updateMutation.mutate(values, {
        onSuccess: () => {
          setDisabled(false)
          setFocus(false)
        }
      })
    }
  }

  return (
    <div className="relative">
      <InputNumber
        disabled={disabled && !focus}
        className="px-3 py-2.5"
        placeholder="Nhập giá trị"
        thousandSeparator={true}
        value={value}
        onValueChange={val => {
          setFocus(true)
          setDisabled(true)
          setValue(val.floatValue)
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          typingTimeoutRef.current = setTimeout(
            () => {
              onSubmit(val.floatValue)
            },
            rowData?.filters ? 600 : 600
          )
        }}
        allowNegative={false}
        isAllowed={inputObj => {
          const { floatValue, value } = inputObj
          if (value !== '' && floatValue < 0) return
          return true
        }}
        // onBlur={val => {
        //   onSubmit(value)
        // }}
      />
      {focus && (
        <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full pointer-events-none">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  )
}

const RendererLevels = ({ rowData, name, setDisabled, disabled }) => {
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)

  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    if (rowData.BonusJSON) {
      let BonusSales = JSON.parse(rowData.BonusJSON)
      let index = BonusSales.findIndex(x => x.Level === name)
      if (index > -1) setValue(BonusSales[index].Salary || '')
    }
  }, [rowData, name])

  const updateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await ProdsAPI.prod24UpdateKPI(body)
      await queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
      return data
    }
  })

  const onSubmit = val => {
    if (rowData.filters) {
      let values = {
        updatebyFilter: rowData.filters,
        BonusJSON: JSON.stringify([{ Level: name, Salary: val || '' }])
      }
      Swal.fire({
        customClass: {
          confirmButton: 'bg-success'
        },
        title: 'Xác nhận cập nhật ?',
        html: `Tất cả các sản phẩm được tìm kiếm theo bộ lọc sẽ được cập nhật về ${name} : ${
          val || 0
        } và không thể khôi phục.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Thực hiện',
        cancelButtonText: 'Huỷ',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const data = await updateMutation.mutateAsync(values)
          return data
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
        setDisabled(false)
        setFocus(false)
        setValue('')
        if (result.isConfirmed) {
          window?.top?.toastr?.success('Đã cập nhật tất cả.', '', {
            timeOut: 1500
          })
        }
      })
    } else {
      let BonusSales = JSON.parse(rowData.BonusJSON)
      let index = BonusSales.findIndex(x => x.Level === name)

      BonusSales[index].Salary = val || ''

      let values = {
        update: [
          {
            ID: rowData.ID,
            BonusJSON: JSON.stringify(BonusSales)
          }
        ]
      }
      updateMutation.mutate(values, {
        onSuccess: () => {
          setDisabled(false)
          setFocus(false)
        }
      })
    }
  }

  return (
    <div className="relative">
      <InputNumber
        disabled={disabled && !focus}
        className="px-3 py-2.5"
        placeholder="Nhập giá trị"
        thousandSeparator={true}
        value={value}
        onValueChange={val => {
          setValue(val.floatValue)
          setFocus(true)
          setDisabled(true)
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          typingTimeoutRef.current = setTimeout(
            () => {
              onSubmit(val.floatValue)
            },
            rowData?.filters ? 600 : 600
          )
        }}
        allowNegative={false}
        isAllowed={inputObj => {
          const { floatValue, value } = inputObj
          if (value !== '' && floatValue < 0) return
          return true
        }}
      />
      {focus && (
        <div className="absolute top-0 right-0 flex items-center justify-center w-12 h-full pointer-events-none">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  )
}

function TourSalary() {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    key: '',
    types: 795,
    setTour: 1
  })

  const [levels, setLevels] = useState([])
  const [disabled, setDisabled] = useState(false)

  const { LayoutIframe } = useLayout()

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['ListProdRose', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await ProdsAPI.getListProd24({
        ...filters,
        pi: pageParam
      })
      pageParam === 1 && setLevels(data.levels)
      return {
        ...data,
        list: data.list
          ? data.list.map(x => ({
              ...x,
              children: x.IsAddFee === 0 ? x.Children : null
            }))
          : []
      }
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1
  })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'list')

  const columns = useMemo(
    () => {
      let clms = [
        {
          key: 'ID',
          title: 'ID',
          dataKey: 'ID',
          width: 120,
          sortable: false
        },
        {
          key: 'Title',
          title: 'Tên mặt hàng',
          dataKey: 'Title',
          width: 300,
          sortable: false,
          cellRenderer: ({ rowData }) => (
            <>
              <div className="flex w-full">
                <Text className="flex-1" tooltipMaxWidth={280}>
                  {rowData.Title}
                </Text>
                {!rowData.filters &&
                  rowData.children &&
                  rowData.children.length > 0 && (
                    <ChevronDownIcon className="w-3.5 ml-1" />
                  )}
              </div>
            </>
          )
          //align: 'center',
        },
        {
          key: 'Bonus',
          title: 'Lương Tour chung',
          dataKey: 'Bonus',
          width: 180,
          sortable: false,
          cellRenderer: props => (
            <RendererBonusSale
              disabled={disabled}
              setDisabled={setDisabled}
              {...props}
            />
          )
        }
      ]

      for (let level of levels) {
        clms.push({
          key: level,
          title: level,
          dataKey: level,
          width: 150,
          sortable: false,
          cellRenderer: props => (
            <RendererLevels
              disabled={disabled}
              setDisabled={setDisabled}
              name={level}
              {...props}
            />
          )
        })
      }

      return clms
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Lists]
  )

  const rowRenderer = ({ rowData, cells }) => {
    return cells
  }

  return (
    <div className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between mb-5">
        {!LayoutIframe && (
          <div>
            <div className="text-3xl font-bold dark:text-white">
              Cài đặt lương Tour
            </div>
            <div className="mt-1.5">
              Thêm và quản lý lương Tour trên từng mặt hàng
            </div>
          </div>
        )}
        {LayoutIframe && (
          <div className="w-full mt-2.5 textx-muted text-gray-600">
            Trường hợp setup cả 2 hệ thống sẽ ưu tiên tính toán theo lương Tour
            cấp bậc
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6 pb-6">
        <Input
          placeholder="Nhập từ khóa ..."
          value={filters.key}
          onChange={e =>
            setFilters(prevState => ({
              ...prevState,
              key: e.target.value
            }))
          }
        />
        <SelectCategories
          allOptions={true}
          //isClearable
          value={filters.types}
          onChange={val =>
            setFilters(prevState => ({
              ...prevState,
              types: val ? val.value : ''
            }))
          }
          Type="DV,PP"
          className="select-control"
          menuPosition="fixed"
          styles={{
            menuPortal: base => ({
              ...base,
              zIndex: 9999
            })
          }}
          menuPortalTarget={document.body}
          placeholder="Chọn danh mục"
          noOptionsMessage={() => 'Danh mục trống.'}
          isValidNewOption={() => false}
        />
      </div>
      <div
        className="flex flex-col grow"
        onKeyDown={e => {
          if (e.key === 'Enter') e.preventDefault()
        }}
      >
        <ReactBaseTable
          loading={isLoading}
          wrapClassName="grow bg-white dark:bg-dark-app rounded"
          rowKey="ID"
          columns={columns}
          data={Lists || []}
          rowHeight={78}
          onEndReachedThreshold={1}
          onEndReached={fetchNextPage}
          frozenData={[
            { filters, Title: 'Cập nhật tất cả theo bộ lọc', levels }
          ]}
          expandColumnKey={columns[1].key}
          rowRenderer={rowRenderer}
          // expandIconProps={({ expandable, expanded, onExpand }) => {
          //   let cls = 'table__expandicon'

          //   if (expandable === false) {
          //     return null
          //   }

          //   if (expanded === true) {
          //     cls += ' expanded'
          //   }

          //   return (
          //     <span
          //       className={cls}
          //       onClick={() => {
          //         onExpand(!expanded)
          //       }}
          //     />
          //   )
          // }}
        />
      </div>
    </div>
  )
}

export default TourSalary
