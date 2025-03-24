import React, { useState, useEffect, useMemo, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Input, InputNumber } from 'src/_ezs/partials/forms'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { SelectCategories } from 'src/_ezs/partials/select'
import clsx from 'clsx'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { formatArray } from 'src/_ezs/utils/formatArray'
import Swal from 'sweetalert2'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import Select from 'react-select'

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

const RendererBonusSale = ({ rowData, invalidateQueries }) => {
  const [value, setValue] = useState(null)
  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValue(rowData.BonusSale)
  }, [rowData])

  const updateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await ProdsAPI.prod24UpdateKPI(body)
      if (invalidateQueries) {
        await Promise.all(
          invalidateQueries.map(key => queryClient.invalidateQueries([key]))
        )
      }
      await queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
      return data
    }
  })

  const onSubmit = val => {
    let values = {
      update: [
        {
          ID: rowData.ID,
          BonusSale: val || ''
        }
      ]
    }
    if (rowData.filters) {
      values = {
        BonusSale: val,
        updatebyFilter: rowData.filters
      }
      Swal.fire({
        customClass: {
          confirmButton: 'bg-success'
        },
        title: 'Xác nhận cập nhập ?',
        html: `Tất cả các sản phẩm được tìm kiếm theo bộ lọc sẽ được cập nhật về loại hoa hồng tư vấn : ${
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
        onSuccess: () => {}
      })
    }
  }

  const getActive = () => {
    if (!rowData?.filters) {
      let BonusSaleJSON = JSON.parse(rowData.BonusSaleJSON)
      if (rowData.BonusSale > 0 && BonusSaleJSON.some(x => x.Salary > 0)) {
        return
      } else {
        if (rowData.BonusSale > 0) return true
      }
    }
    return
  }

  return (
    <InputNumber
      className={clsx(
        'px-3 py-2.5',
        getActive() &&
          '!border-danger hover:!border-primary focus:!border-primary'
      )}
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
  )
}

const RendererBonusSale2 = ({ rowData, invalidateQueries }) => {
  const [value, setValue] = useState(null)
  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValue(rowData.BonusSale2)
  }, [rowData])

  const updateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await ProdsAPI.prod24UpdateKPI(body)
      if (invalidateQueries) {
        await Promise.all(
          invalidateQueries.map(key => queryClient.invalidateQueries([key]))
        )
      }
      await queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
      return data
    }
  })

  const onSubmit = val => {
    let values = {
      update: [
        {
          ID: rowData.ID,
          BonusSale2: val || ''
        }
      ]
    }
    if (rowData.filters) {
      values = {
        BonusSale2: val,
        updatebyFilter: rowData.filters
      }
      Swal.fire({
        customClass: {
          confirmButton: 'bg-success'
        },
        title: 'Xác nhận cập nhập ?',
        html: `Tất cả các sản phẩm được tìm kiếm theo bộ lọc sẽ được cập nhật về loại hoa hồng tư vấn khách mới : ${
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
        onSuccess: () => {}
      })
    }
  }

  const getActive = () => {
    if (!rowData?.filters) {
      let BonusSaleJSON = JSON.parse(rowData.BonusSaleJSON)
      if (rowData.BonusSale2 > 0 && BonusSaleJSON.some(x => x.Salary > 0)) {
        return
      } else {
        if (rowData.BonusSale2 > 0) return true
      }
    }
    return
  }

  return (
    <InputNumber
      className={clsx(
        'px-3 py-2.5',
        getActive() &&
          '!border-danger hover:!border-primary focus:!border-primary'
      )}
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
  )
}

const RendererLevels = ({ rowData, name, levels, invalidateQueries }) => {
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    if (rowData.BonusSaleJSON) {
      let BonusSales = JSON.parse(rowData.BonusSaleJSON)
      let index = BonusSales.findIndex(x => x.Level === name)
      if (index > -1) setValue(BonusSales[index].Salary || 0)
    }
  }, [rowData, name, levels])

  const updateMutation = useMutation({
    mutationFn: async body => {
      let { data } = await ProdsAPI.prod24UpdateKPI(body)
      if (invalidateQueries) {
        await Promise.all(
          invalidateQueries.map(key => queryClient.invalidateQueries([key]))
        )
      }
      await queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
      return data
    }
  })

  const onSubmit = val => {
    if (rowData.filters) {
      let values = {
        updatebyFilter: rowData.filters,
        BonusSaleJSON: JSON.stringify([{ Level: name, Salary: val || '' }])
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
      let BonusSales = JSON.parse(rowData.BonusSaleJSON)
      let index = BonusSales.findIndex(x => x.Level === name)

      BonusSales[index].Salary = val

      let values = {
        update: [
          {
            ID: rowData.ID,
            BonusSaleJSON: JSON.stringify(BonusSales)
          }
        ]
      }
      updateMutation.mutate(values, {
        onSuccess: () => {}
      })
    }
  }

  const getActive = () => {
    if (!rowData?.filters) {
      let BonusSaleJSON = JSON.parse(rowData.BonusSaleJSON)
      if (BonusSaleJSON.some(x => x.Salary > 0)) {
        return true
      }
    }
    return
  }

  return (
    <InputNumber
      className={clsx(
        'px-3 py-2.5',
        getActive() &&
          '!border-danger hover:!border-primary focus:!border-primary'
      )}
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
  )
}

function PickerSettingsCommission({ children, Type, invalidateQueries }) {
  const { GlobalConfig } = useLayout()
  const [visible, setVisible] = useState(false)

  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    hascombo: 1,
    key: '',
    types: '',
    display: '1',
    setBonus: 1,
    byPublic: '',
    skip_display: '0'
  })

  const [levels, setLevels] = useState([])

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
  }, [visible, Type])

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['ListProdRose', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await ProdsAPI.getListProd24({
        ...filters,
        skip_display: !filters.display ? '1' : '0',
        pi: pageParam
      })
      pageParam === 1 && setLevels(data.levels)
      return {
        ...data,
        list: data.list
          ? data.list.map(x => ({
              ...x,
              BonusSaleJSON:
                x.BonusSaleJSON && x.BonusSaleJSON !== 'null'
                  ? x.BonusSaleJSON
                  : JSON.stringify(
                      data.levels.map(o => ({
                        Level: o,
                        Salary: null
                      }))
                    )
            }))
          : []
      }
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1,
    enabled: visible
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
          sortable: false
          //align: 'center',
        },
        {
          key: 'BonusSale2',
          title: 'Hoa hồng tư vấn khách mới',
          dataKey: 'BonusSale2',
          width: 250,
          sortable: false,
          cellRenderer: props => (
            <RendererBonusSale2
              invalidateQueries={invalidateQueries}
              {...props}
            />
          ),
          hidden: GlobalConfig?.Admin?.hoa_hong_tu_van_ktv_an
        },
        {
          key: 'BonusSale',
          title: 'Hoa hồng tư vấn',
          dataKey: 'BonusSale',
          width: 180,
          sortable: false,
          cellRenderer: props => (
            <RendererBonusSale
              invalidateQueries={invalidateQueries}
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
          width: 200,
          sortable: false,
          cellRenderer: props => (
            <RendererLevels
              invalidateQueries={invalidateQueries}
              name={level}
              levels={levels}
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

  const onHide = () => {
    setVisible(false)
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <div
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
            <div className="grid grid-cols-3 gap-6 p-6 mx-auto max-w-[1440px] w-full">
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
              <Select
                isClearable
                value={OptionsStatus.filter(x => filters.display === x?.value)}
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
            <div className="flex flex-col w-full px-6 pb-6 mx-auto max-w-[1440px] grow">
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
              />
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerSettingsCommission
