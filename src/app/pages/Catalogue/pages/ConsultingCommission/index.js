import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import { SelectCategories } from 'src/_ezs/partials/select'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import Swal from 'sweetalert2'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { formatString } from 'src/_ezs/utils/formatString'
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

function ConsultingCommission() {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 10000,
    //hascombo: 1,
    key: '',
    types: '',
    display: 1,
    setBonus: 0,
    hascombo1: 1,
    getRootFirst: 1
  })

  const [levels, setLevels] = useState([])

  const { LayoutIframe, GlobalConfig } = useLayout()

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      Items: []
    }
  })

  useEffect(() => {
    reset({ Items: [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'Items' // unique name for your Field Array
  })

  const { isLoading, refetch } = useQuery({
    queryKey: ['ListProdRose', filters],
    queryFn: async () => {
      const { data } = await ProdsAPI.getListProd24({
        ...filters,
        skip_display: !filters.display ? '1' : '0',
        pi: 1
      })

      return {
        ...data,
        list: data.list
          ? data.list.map(x => {
              let newBonusSaleJSON =
                x.BonusSaleJSON && x.BonusSaleJSON !== 'null'
                  ? x.BonusSaleJSON
                  : JSON.stringify(
                      data.levels.map(o => ({
                        Level: o,
                        Salary: null
                      }))
                    )

              let obj = {
                ...x,
                BonusSaleJSON: newBonusSaleJSON,
                BonusSaleJSONs: JSON.parse(newBonusSaleJSON)
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

  const updateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await ProdsAPI.prod24UpdateKPI(body)
      await refetch()
      return data
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
          sortable: false,
          frozen: 'left'
        },
        {
          key: 'Title',
          title: 'Tên mặt hàng',
          dataKey: 'Title',
          width: 300,
          sortable: false,
          frozen: 'left'
          //align: 'center',
        },
        {
          key: 'BonusSale2',
          title: 'Hoa hồng tư vấn khách mới',
          dataKey: 'BonusSale2',
          width: 250,
          sortable: false,
          cellRenderer: ({ rowIndex, rowData }) => {
            let active = false
            if (!rowData?.filters) {
              let BonusSaleJSON = JSON.parse(rowData.BonusSaleJSON)
              if (
                rowData.BonusSale > 0 &&
                BonusSaleJSON.some(x => x.Salary > 0)
              ) {
              } else {
                if (rowData.BonusSale2 > 0) active = true
              }
            }
            if (rowData?.filters) {
              return (
                <RendererBonusAll
                  onSubmit={({ Value, callback }) => {
                    onBonusSubmit({
                      rowData,
                      name: 'loại hoa hồng tư vấn khách mới',
                      Value,
                      Key: 'BonusSale2',
                      callback
                    })
                  }}
                />
              )
            }
            return (
              <Controller
                name={`Items[${rowIndex}].BonusSale2`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    className={clsx(
                      'px-3 py-2.5',
                      active &&
                        '!border-danger hover:!border-primary focus:!border-primary'
                    )}
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
          },
          hidden: GlobalConfig?.Admin?.hoa_hong_tu_van_ktv_an
        },
        {
          key: 'BonusSale',
          title: 'Hoa hồng tư vấn',
          dataKey: 'BonusSale',
          width: 180,
          sortable: false,
          cellRenderer: ({ rowIndex, rowData }) => {
            let active = false
            if (!rowData?.filters) {
              let BonusSaleJSON = JSON.parse(rowData.BonusSaleJSON)
              if (
                rowData.BonusSale > 0 &&
                BonusSaleJSON.some(x => x.Salary > 0)
              ) {
              } else {
                if (rowData.BonusSale > 0) active = true
              }
            }
            if (rowData?.filters) {
              return (
                <RendererBonusAll
                  onSubmit={({ Value, callback }) => {
                    onBonusSubmit({
                      rowData,
                      name: 'loại hoa hồng tư vấn',
                      Value,
                      Key: 'BonusSale',
                      callback
                    })
                  }}
                />
              )
            }
            return (
              <Controller
                name={`Items[${rowIndex}].BonusSale`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    className={clsx(
                      'px-3 py-2.5',
                      active &&
                        '!border-danger hover:!border-primary focus:!border-primary'
                    )}
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
          width: 200,
          sortable: false,
          cellRenderer: ({ rowData, rowIndex }) => {
            let active = false
            if (!rowData?.filters) {
              let BonusSaleJSON = JSON.parse(rowData.BonusSaleJSON)
              if (
                rowData.BonusSale > 0 &&
                BonusSaleJSON.some(x => x.Salary > 0)
              ) {
              } else {
                if (rowData.BonusSale > 0) {
                  active = true
                }
              }
            }
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
                name={`Items[${rowIndex}].BonusSaleJSONs[${i}].Salary`}
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputNumber
                    className={clsx(
                      'px-3 py-2.5',
                      active &&
                        '!border-danger hover:!border-primary focus:!border-primary'
                    )}
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

  const onSubmit = ({ Items }) => {
    let values = {
      update: Items.map(x => ({
        ID: x.ID,
        BonusSaleJSON: JSON.stringify(x.BonusSaleJSONs),
        BonusSale: x.BonusSale || '',
        BonusSale2: x.BonusSale2 || ''
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
      BonusSaleJSON: JSON.stringify([{ Level: name, Salary: Value }])
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl"
    >
      <div className="flex flex-wrap items-end justify-between mb-5">
        {!LayoutIframe && (
          <div>
            <div className="text-3xl font-bold dark:text-white">
              Cài đặt hoa hồng
            </div>
            <div className="mt-1.5">
              Thêm và quản lý hoa hồng trên từng mặt hàng
            </div>
          </div>
        )}

        {/* <div className="inline-flex rounded-md shadow-sm">
          {Categories.data &&
            Categories.data.map((item, index) => (
              <div
                className={clsx(
                  'px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 hover:bg-gray-100 cursor-pointer first:rounded-l-lg first:border-l last:rounded-r-lg',
                  Number(filters.types) === item.ID
                    ? 'text-primary'
                    : 'text-gray-900'
                )}
                onClick={() =>
                  item.ID > 0 &&
                  setFilters(prevState => ({
                    ...prevState,
                    types: item.ID
                  }))
                }
                key={index}
              >
                {item.Title}
              </div>
            ))}
        </div> */}
        {LayoutIframe && (
          <div className="w-full mt-2.5 textx-muted text-gray-600">
            Trường hợp setup cả 2 hệ thống sẽ ưu tiên tính toán theo hoa hồng
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
              isClearable
              value={filters.types}
              onChange={val =>
                setFilters(prevState => ({
                  ...prevState,
                  types: val ? val.value : ''
                }))
              }
              Type="SP,DV,NH,NVL,PP,TT"
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
      <div
        className="flex flex-col grow"
        onKeyDown={e => {
          if (e.key === 'Enter') e.preventDefault()
        }}
      >
        <ReactBaseTable
          loading={isLoading}
          wrapClassName="grow bg-white dark:bg-dark-app rounded"
          rowKey="id"
          columns={columns}
          data={fields || []}
          rowHeight={78}
          // onEndReachedThreshold={1}
          // onEndReached={fetchNextPage}
          frozenData={
            !isLoading
              ? [
                  {
                    filters,
                    Title: 'Cập nhật tất cả theo bộ lọc',
                    levels
                  }
                ]
              : []
          }
        />
      </div>
    </form>
  )
}

export default ConsultingCommission
