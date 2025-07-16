import React, { useState, useEffect, useMemo, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { SelectCategories } from 'src/_ezs/partials/select'
import clsx from 'clsx'
import ProdsAPI from 'src/_ezs/api/prods.api'
import Swal from 'sweetalert2'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import Select from 'react-select'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { formatString } from 'src/_ezs/utils/formatString'

const OptionsStatus = [
  {
    value: '1',
    label: 'Đang kinh doanh'
  },
  {
    value: '2',
    label: 'Ngừng kinh doanh'
  }
]

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

function PickerSettingsCommission({ children, Type, invalidateQueries }) {
  const { GlobalConfig } = useLayout()
  const [visible, setVisible] = useState(false)

  const [filters, setFilters] = useState({
    pi: 1,
    ps: 10000,
    hascombo: 1,
    key: '',
    types: '',
    display: '1',
    setBonus: 1,
    byPublic: '',
    skip_display: '0'
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

  useEffect(() => {
    if (Type) {
      setFilters(prevState => ({
        ...prevState,
        types: Type?.value || '',
        display: '1'
      }))
    } else {
      setFilters(prevState => ({
        ...prevState,
        types: ''
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    reset({ Items: [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

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
    },
    enabled: visible
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
          sortable: false
        },
        {
          key: 'Title',
          title: 'Tên mặt hàng',
          dataKey: 'Title',
          width: 300,
          sortable: false
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

  const onHide = () => {
    setVisible(false)
  }

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
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="fixed top-0 left-0 z-[1003] bg-white h-full w-full flex flex-col"
            autoComplete="off"
          >
            <div className="relative flex justify-between p-4 border-b md:px-8 md:py-6 border-separator">
              <div className="flex items-center text-2xl font-semibold md:text-3xl">
                Cài đặt hoa hồng
              </div>
              <Button
                className="absolute flex items-center justify-center w-12 h-12 transition-all right-6 top-2/4 -translate-y-2/4 opacity-80 hover:opacity-100"
                onClick={onHide}
                type="button"
              >
                <XMarkIcon className="w-8" />
              </Button>
            </div>
            <div className="flex gap-6 p-6 mx-auto max-w-[1440px] w-full">
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
                  onChange={val => {
                    setFilters(prevState => ({
                      ...prevState,
                      types: val ? val.value : ''
                    }))
                  }}
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
              <div className="flex-1">
                <Select
                  isClearable
                  value={OptionsStatus.filter(
                    x => filters.display === x?.value
                  )}
                  className="select-control"
                  onChange={val => {
                    setFilters(prevState => ({
                      ...prevState,
                      display: val?.value || ''
                    }))
                  }}
                  classNamePrefix="select"
                  options={OptionsStatus}
                  placeholder="Chọn trạng thái"
                  noOptionsMessage={() => 'Không có dữ liệu'}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: base => ({
                      ...base,
                      zIndex: 9999
                    })
                  }}
                  menuPortalTarget={document.body}
                />
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
            <div className="flex flex-col w-full px-6 pb-6 mx-auto max-w-[1440px] grow">
              <ReactBaseTable
                loading={isLoading}
                wrapClassName="grow bg-white dark:bg-dark-app rounded"
                rowKey="id"
                columns={columns}
                data={fields || []}
                rowHeight={78}
                //onEndReachedThreshold={1}
                //onEndReached={fetchNextPage}
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
                // onScroll={e => {
                //   if (disabled) setDisabled(false)
                // }}
              />
            </div>
          </form>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerSettingsCommission
