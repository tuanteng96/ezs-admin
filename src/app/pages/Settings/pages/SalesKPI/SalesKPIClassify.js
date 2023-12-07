import React, { useEffect, useState, useMemo } from 'react'
import { LayoutGroup, m } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { formatArray } from 'src/_ezs/utils/formatArray'
import { SelectCategories, SelectTypeGenerate } from 'src/_ezs/partials/select'
import { Input } from 'src/_ezs/partials/forms'
import useDebounce from 'src/_ezs/hooks/useDebounce'

const EditableCell = ({ rowData }) => {
  const [value, setValue] = useState('')

  const queryClient = useQueryClient()

  useEffect(() => {
    if (rowData?.KpiType || rowData?.KpiType === -1) {
      setValue({
        label: 'Loại ' + rowData?.KpiType,
        value: Number(rowData?.KpiType)
      })
    } else {
      setValue('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData])

  const updateKPIMutation = useMutation({
    mutationFn: body => ProdsAPI.prod24UpdateKPI(body)
  })

  const onSubmit = val => {
    let values = {
      update: [
        {
          ID: rowData.ID,
          KpiType: val ? val.value : 0
        }
      ]
    }

    if (rowData.filters) {
      values = {
        KpiType: val ? val.value : 0,
        updatebyFilter: rowData.filters
      }
    }

    updateKPIMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ListProd24'] }).then(() => {
          if (rowData.filters) {
            setValue('')
            window?.top?.toastr?.success('Đã cập nhập tất cả.', '', {
              timeOut: 1500
            })
          }
        })
      }
    })
  }

  return (
    <div className="w-full">
      <SelectTypeGenerate
        isDisabled={updateKPIMutation.isLoading}
        isLoading={updateKPIMutation.isLoading}
        isClearable
        value={value}
        onChange={val => {
          setValue(val)
          onSubmit(val)
        }}
        className="select-control w-full"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
      />
    </div>
  )
}

function SalesKPIClassify() {
  const [filters, setFilters] = useState({
    pi: 1,
    ps: 20,
    hascombo: 1,
    key: '',
    types: '',
    display: 1
  })
  const { pathname, state, search } = useLocation()
  const navigate = useNavigate()

  const debouncedKey = useDebounce(filters, 300)

  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['ListProd24', debouncedKey],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await ProdsAPI.getListProd24({
        ...filters,
        pi: pageParam
      })
      return data
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1
  })

  const Lists = formatArray.useInfiniteQuery(data?.pages, 'list')

  const columns = useMemo(
    () => [
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
        width: 450,
        sortable: false
        //align: 'center',
      },
      {
        key: 'KpiType',
        title: 'Loại KPI',
        dataKey: 'KpiType',
        width: 250,
        sortable: false,
        cellRenderer: props => <EditableCell {...props} />
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Lists]
  )

  return (
    <LayoutGroup key={pathname}>
      <div className="fixed w-full h-full z-[1002] top-0 left-0">
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="absolute w-full h-full top-0 left bg-black/[.2] dark:bg-black/[.4]"
            onClick={() =>
              navigate({
                pathname: state?.prevFrom,
                search: search
              })
            }
          ></div>
        </m.div>
        <m.div
          className="absolute top-0 right-0 z-10 w-full h-full bg-white max-w-4xl dark:bg-dark-aside"
          initial={{ x: '100%' }}
          transition={{
            transform: { ease: 'linear' }
          }}
          animate={{ x: '0' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-separator dark:border-dark-separator">
              <div className="text-xl lg:text-2xl font-bold dark:text-graydark-800 truncate w-10/12">
                Phân loại nhóm KPI
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 transition cursor-pointer dark:text-graydark-800 hover:text-primary"
                onClick={() =>
                  navigate({
                    pathname: state?.prevFrom,
                    search: search
                  })
                }
              >
                <XMarkIcon className="w-7 lg:w-9" />
              </div>
            </div>
            <div className="px-6 pt-6 grid grid-cols-2 gap-6">
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
            <form
              className="flex flex-col grow"
              onKeyDown={e => {
                if (e.key === 'Enter') e.preventDefault()
              }}
            >
              <ReactBaseTable
                loading={isLoading}
                wrapClassName="p-4 lg:p-6 grow bg-white dark:bg-dark-app rounded"
                rowKey="ID"
                columns={columns}
                data={Lists || []}
                rowHeight={78}
                onEndReachedThreshold={1}
                onEndReached={fetchNextPage}
                frozenData={[{ filters, Title: 'Cập nhập tất cả theo bộ lọc' }]}
              />
            </form>
          </div>
        </m.div>
      </div>
    </LayoutGroup>
  )
}

export default SalesKPIClassify
