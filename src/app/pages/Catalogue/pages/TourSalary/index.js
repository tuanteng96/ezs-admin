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

const RendererBonusSale = ({ rowData }) => {
  const [value, setValue] = useState(null)
  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValue(rowData.Bonus)
  }, [rowData])

  const updateMutation = useMutation({
    mutationFn: body => ProdsAPI.prod24UpdateKPI(body)
  })

  const onSubmit = val => {
    let values = {
      update: [
        {
          ID: rowData.ID,
          Bonus: val
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
        title: 'Xác nhận cập nhập ?',
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
          await queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
          return data
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
        if (result.isConfirmed) {
          setValue('')
          window?.top?.toastr?.success('Đã cập nhập tất cả.', '', {
            timeOut: 1500
          })
        } else {
          setValue('')
        }
      })
    } else {
      updateMutation.mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
        }
      })
    }
  }

  return (
    <InputNumber
      className="px-3 py-2.5"
      placeholder="Nhập giá trị"
      thousandSeparator={true}
      value={value}
      onValueChange={val => {
        setValue(val.floatValue)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(
          () => {
            onSubmit(val.floatValue)
          },
          rowData?.filters ? 600 : 300
        )
      }}
      allowNegative={false}
      isAllowed={inputObj => {
        const { floatValue } = inputObj
        if (floatValue < 0) return
        return true
      }}
    />
  )
}

const RendererLevels = ({ rowData, name }) => {
  const [value, setValue] = useState()
  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    if (rowData.BonusJSON) {
      let BonusSales = JSON.parse(rowData.BonusJSON)
      let index = BonusSales.findIndex(x => x.Level === name)
      if (index > -1) setValue(BonusSales[index].Salary || 0)
    }
  }, [rowData, name])

  const updateMutation = useMutation({
    mutationFn: body => ProdsAPI.prod24UpdateKPI(body)
  })

  const onSubmit = val => {
    if (rowData.filters) {
      let values = {
        Bonus: 0,
        updatebyFilter: rowData.filters,
        BonusJSON: JSON.stringify([{ Level: name, Salary: val || null }])
      }
      Swal.fire({
        customClass: {
          confirmButton: 'bg-success'
        },
        title: 'Xác nhận cập nhập ?',
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
          await queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
          return data
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
        if (result.isConfirmed) {
          setValue('')
          window?.top?.toastr?.success('Đã cập nhập tất cả.', '', {
            timeOut: 1500
          })
        } else {
          setValue('')
        }
      })
    } else {
      let BonusSales = JSON.parse(rowData.BonusJSON)
      let index = BonusSales.findIndex(x => x.Level === name)

      BonusSales[index].Salary = val

      let values = {
        update: [
          {
            ID: rowData.ID,
            Bonus: 0,
            BonusJSON: JSON.stringify(BonusSales)
          }
        ]
      }
      updateMutation.mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
        }
      })
    }
  }

  return (
    <InputNumber
      className="px-3 py-2.5"
      placeholder="Nhập giá trị"
      thousandSeparator={true}
      value={value}
      onValueChange={val => {
        setValue(val.floatValue)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(
          () => {
            onSubmit(val.floatValue)
          },
          rowData?.filters ? 600 : 300
        )
      }}
      allowNegative={false}
      isAllowed={inputObj => {
        const { floatValue } = inputObj
        if (floatValue < 0) return
        return true
      }}
    />
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
          cellRenderer: props => <RendererBonusSale {...props} />
        }
      ]

      for (let level of levels) {
        clms.push({
          key: level,
          title: level,
          dataKey: level,
          width: 150,
          sortable: false,
          cellRenderer: props => <RendererLevels name={level} {...props} />
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
    <div className="flex flex-col h-full lg:px-8 lg:pt-8 lg:pb-5 p-4 mx-auto max-w-7xl">
      <div className="flex items-end flex-wrap justify-between mb-5">
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
            { filters, Title: 'Cập nhập tất cả theo bộ lọc', levels }
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
