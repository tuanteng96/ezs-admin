import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { useLayout } from 'src/_ezs/layout/LayoutProvider'
import { InputNumber } from 'src/_ezs/partials/forms'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { formatArray } from 'src/_ezs/utils/formatArray'

const RendererBonusSale = ({ rowData }) => {
  const [value, setValue] = useState(0)
  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValue(rowData.BonusSale)
  }, [rowData])

  const updateMutation = useMutation({
    mutationFn: body => ProdsAPI.prod24UpdateKPI(body)
  })

  const onSubmit = val => {
    let values = {
      update: [
        {
          ID: rowData.ID,
          BonusSale: val
        }
      ]
    }
    updateMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
      }
    })
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
        typingTimeoutRef.current = setTimeout(() => {
          onSubmit(val.floatValue)
        }, 300)
      }}
      allowNegative={false}
      isAllowed={inputObj => {
        const { floatValue } = inputObj
        if (floatValue < 1) return
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
    if (rowData.BonusSaleJSON) {
      let BonusSales = JSON.parse(rowData.BonusSaleJSON)
      let index = BonusSales.findIndex(x => x.Level === name)
      if (index > -1) setValue(BonusSales[index].Salary || 0)
    }
  }, [rowData, name])

  const updateMutation = useMutation({
    mutationFn: body => ProdsAPI.prod24UpdateKPI(body)
  })

  const onSubmit = val => {
    let BonusSales = JSON.parse(rowData.BonusSaleJSON)
    let index = BonusSales.findIndex(x => x.Level === name)

    BonusSales[index].Salary = val

    let values = {
      update: [
        {
          ID: rowData.ID,
          BonusSale: 0,
          BonusSaleJSON: JSON.stringify(BonusSales)
        }
      ]
    }
    updateMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ListProdRose'] })
      }
    })
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
        typingTimeoutRef.current = setTimeout(() => {
          onSubmit(val.floatValue)
        }, 300)
      }}
      allowNegative={false}
      isAllowed={inputObj => {
        const { floatValue } = inputObj
        if (floatValue < 1) return
        return true
      }}
    />
  )
}

function ConsultingCommission() {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    hascombo: 1,
    key: '',
    types: 794,
    display: 1
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
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1
  })

  const Categories = useQuery({
    queryKey: ['Categories-products'],
    queryFn: async () => {
      const { data } = await ProdsAPI.getListCategory()
      return data
        ? [
            {
              Title: 'Sản phẩm',
              ID: data['SP'][0].ID
            },
            {
              Title: 'Dịch vụ',
              ID: data['DV'][0].ID
            },
            {
              Title: 'Phụ phí',
              ID: data['PP'][0].ID
            },
            {
              Title: 'Thẻ tiền',
              ID: data['TT'][0].ID
            },
            {
              Title: 'NVL',
              ID: data['NVL'][0].ID
            }
          ]
        : []
    },
    initialData: [
      {
        Title: 'Sản phẩm',
        ID: 794
      },
      {
        Title: 'Dịch vụ',
        ID: 0
      },
      {
        Title: 'Phụ phí',
        ID: 0
      },
      {
        Title: 'Thẻ tiền',
        ID: 0
      },
      {
        Title: 'NVL',
        ID: 0
      }
    ]
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
          key: 'BonusSale',
          title: 'Hoa hồng tư vấn',
          dataKey: 'BonusSale',
          width: 200,
          sortable: false,
          cellRenderer: props => <RendererBonusSale {...props} />
        }
      ]

      for (let level of levels) {
        clms.push({
          key: level,
          title: level,
          dataKey: level,
          width: 200,
          sortable: false,
          cellRenderer: props => <RendererLevels name={level} {...props} />
        })
      }

      return clms
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Lists]
  )

  return (
    <div className="flex flex-col h-full lg:px-8 lg:pt-8 lg:pb-5 p-4 mx-auto max-w-7xl">
      <div className="flex items-end justify-between mb-5">
        {!LayoutIframe && (
          <div>
            <div className="text-3xl font-bold dark:text-white">
              Hoa hồng tư vấn
            </div>
            <div className="mt-1.5">
              Thêm và quản lý hoa hồng tư vấn trên từng mặt hàng
            </div>
          </div>
        )}

        <div className="inline-flex rounded-md shadow-sm">
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
        </div>
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
        />
      </div>
    </div>
  )
}

export default ConsultingCommission
