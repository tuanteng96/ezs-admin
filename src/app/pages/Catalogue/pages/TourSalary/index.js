import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
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
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { formatString } from 'src/_ezs/utils/formatString'
import clsx from 'clsx'
import { Button } from 'src/_ezs/partials/button'

const RendererLevelAll = ({ onSubmit }) => {
  const [Value, setValue] = useState('')

  const typingTimeoutRef = useRef(null)

  return (
    <InputNumber
      className={clsx('px-3 py-2.5')}
      placeholder="Nhập giá trị"
      thousandSeparator={true}
      value={Value}
      onValueChange={val => {
        setValue(val.floatValue)

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
          onSubmit({
            Value: val.floatValue,
            callback: () => setValue('')
          })
        }, 600)
      }}
      allowNegative={false}
      isAllowed={inputObj => {
        const { floatValue, value } = inputObj
        if (value !== '' && floatValue < 0) return
        return true
      }}
    />
  )
}

const RendererBonusAll = ({ onSubmit }) => {
  const [Value, setValue] = useState('')

  const typingTimeoutRef = useRef(null)

  return (
    <InputNumber
      className={clsx('px-3 py-2.5')}
      placeholder="Nhập giá trị"
      thousandSeparator={true}
      value={Value}
      onValueChange={val => {
        setValue(val.floatValue)

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
          onSubmit({
            Value: val.floatValue,
            callback: () => setValue('')
          })
        }, 600)
      }}
      allowNegative={false}
      isAllowed={inputObj => {
        const { floatValue, value } = inputObj
        if (value !== '' && floatValue < 0) return
        return true
      }}
    />
  )
}

function TourSalary() {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 10000,
    key: '',
    types: 795,
    setTour: 1
  })

  const [levels, setLevels] = useState([])

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      Items: []
    }
  })

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'Items' // unique name for your Field Array
  })

  const { LayoutIframe } = useLayout()

  const { refetch, isLoading } = useQuery({
    queryKey: ['ListProdTour', filters],
    queryFn: async () => {
      const { data } = await ProdsAPI.getListProd24({
        ...filters
      })
      return {
        ...data,
        list: data.list
          ? data.list.map(x => {
              let newBonusJSON =
                x.BonusJSON && x.BonusJSON !== 'null'
                  ? x.BonusJSON
                  : JSON.stringify(
                      data.levels.map(o => ({
                        Level: o,
                        Salary: null
                      }))
                    )

              let obj = {
                ...x,
                children: x.IsAddFee === 0 ? x.Children : null,
                BonusJSON: newBonusJSON,
                BonusJSONs: JSON.parse(newBonusJSON)
                  .map(x => ({
                    ...x,
                    PositionIndex: [...(data?.levels || [])].findIndex(
                      o => o === x.Level
                    )
                  }))
                  .filter(x => x.PositionIndex > -1)
                  .sort((a, b) => a.PositionIndex - b.PositionIndex)
              }
              return obj
            })
          : []
      }
    },
    onSuccess: data => {
      reset({
        Items: data?.list || []
      })
      setLevels(data.levels ? data.levels : [])
    }
  })

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
          cellRenderer: ({ rowData, rowIndex }) => {
            if (rowData?.filters) {
              return (
                <RendererBonusAll
                  onSubmit={({ Value, callback }) => {
                    onBonusSubmit({
                      rowData,
                      name: 'loại lương tour',
                      Value,
                      Key: 'Bonus',
                      callback
                    })
                  }}
                />
              )
            }
            return (
              <Controller
                name={`Items[${rowIndex}].Bonus`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    className={clsx('px-3 py-2.5')}
                    placeholder="Nhập giá trị"
                    thousandSeparator={true}
                    value={field.value}
                    onValueChange={val => {
                      field.onChange(val.floatValue)
                    }}
                    allowNegative={false}
                    isAllowed={inputObj => {
                      const { floatValue, value } = inputObj
                      if (value !== '' && floatValue < 0) return
                      return true
                    }}
                  />
                )}
              />
            )
          }
        }
      ]

      for (let [i, level] of levels.entries()) {
        clms.push({
          key: level,
          title: level,
          dataKey: level,
          width: 150,
          sortable: false,
          cellRenderer: ({ rowData, rowIndex }) => {
            if (rowData?.filters) {
              return (
                <RendererLevelAll
                  onSubmit={({ Value, callback }) => {
                    onLevelsSubmit({ rowData, name: level, Value, callback })
                  }}
                />
              )
            }

            return (
              <Controller
                name={`Items[${rowIndex}].BonusJSONs[${i}].Salary`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    className={clsx('px-3 py-2.5')}
                    placeholder="Nhập giá trị"
                    thousandSeparator={true}
                    value={field.value}
                    onValueChange={val => {
                      field.onChange(val.floatValue)
                    }}
                    allowNegative={false}
                    isAllowed={inputObj => {
                      const { floatValue, value } = inputObj
                      if (value !== '' && floatValue < 0) return
                      return true
                    }}
                  />
                )}
              />
            )
          }
        })
      }

      return clms
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  )

  const updateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await ProdsAPI.prod24UpdateKPI(body)
      await refetch()
      return data
    }
  })

  const onSubmit = ({ Items }) => {
    let values = {
      update: Items.map(x => ({
        ID: x.ID,
        BonusJSON: JSON.stringify(x.BonusJSONs),
        Bonus: x.Bonus || ''
      }))
    }

    updateMutation.mutate(values, {
      onSuccess: () => {
        window?.top?.toastr?.success('Cập nhật thành công.', '', {
          timeOut: 1500
        })
      }
    })
  }

  const onLevelsSubmit = ({ rowData, name, Value, callback }) => {
    let values = {
      updatebyFilter: rowData.filters,
      BonusJSON: JSON.stringify([{ Level: name, Salary: Value }])
    }
    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Xác nhận cập nhật ?',
      html: `Tất cả các mặt hàng được tìm kiếm theo bộ lọc sẽ được cập nhật về ${name} : ${formatString.formatVND(
        Value || 0
      )} và không thể khôi phục.`,
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
      if (result.isConfirmed) {
        window?.top?.toastr?.success('Đã cập nhật tất cả.', '', {
          timeOut: 1500
        })
      }
      callback && callback()
    })
  }

  const onBonusSubmit = ({ rowData, name, Value, callback, Key }) => {
    let values = {
      updatebyFilter: rowData.filters
    }
    values[Key] = Value

    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Xác nhận cập nhật ?',
      html: `Tất cả các mặt hàng được tìm kiếm theo bộ lọc sẽ được cập nhật về ${name} : ${formatString.formatVND(
        Value || 0
      )} và không thể khôi phục.`,
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
      if (result.isConfirmed) {
        window?.top?.toastr?.success('Đã cập nhật tất cả.', '', {
          timeOut: 1500
        })
      }
      callback && callback()
    })
  }

  const rowRenderer = ({ rowData, cells }) => {
    return cells
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl"
    >
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
      <div className="flex justify-between gap-6 pb-6">
        <div className="flex w-2/4 gap-4">
          <div className="flex-1">
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
          </div>
          <div className="flex-1">
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
        </div>
        <Button
          disabled={updateMutation.isLoading}
          loading={updateMutation.isLoading}
          type="submit"
          className="w-[160px] relative flex items-center justify-center h-12 px-4 text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
        >
          Lưu thay đổi
        </Button>
      </div>
      <div className="flex flex-col grow">
        <ReactBaseTable
          loading={isLoading}
          wrapClassName="grow bg-white dark:bg-dark-app rounded"
          rowKey="id"
          columns={columns}
          data={fields || []}
          rowHeight={78}
          // onEndReachedThreshold={1}
          // onEndReached={fetchNextPage}
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
    </form>
  )
}

export default TourSalary
