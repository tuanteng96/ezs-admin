import React, { useEffect, useMemo } from 'react'
import { Button } from 'src/_ezs/partials/button'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { useMutation, useQuery } from '@tanstack/react-query'
import SettingsAPI from 'src/_ezs/api/settings.api'
import { useAuth } from 'src/_ezs/core/Auth'
import ConfigAPI from 'src/_ezs/api/config'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { InputNumber } from 'src/_ezs/partials/forms'
import { toast } from 'react-toastify'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

function SettingsPoint(props) {
  const { CrStocks } = useAuth()

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      ConfigsPoint: []
    }
  })

  const { fields } = useFieldArray({
    control,
    name: 'ConfigsPoint'
  })

  const { data, isLoading } = useQuery({
    queryKey: ['ListSettingsPoint'],
    queryFn: async () => {
      let { data } = await SettingsAPI.groupListMembers({
        StockID: CrStocks?.ID
      })
      return data?.data?.list || []
    }
  })

  const ConfigsPoint = useQuery({
    queryKey: ['ListConfigPoint'],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName('tichdiemconfig')
      return data?.data && data?.data.length > 0 ? data?.data[0].Value : null
    },
    enabled: isLoading
  })

  useEffect(() => {
    if (!ConfigsPoint.isLoading && data) {
      if (ConfigsPoint.data) {
        let rs = JSON.parse(ConfigsPoint.data)
        let newRs = []
        let isUpdate =
          rs
            .filter(x => x.ID !== '-1' && x.ID !== '-2')
            .sort((a, b) => a.ID - b.ID)
            .toString() === data.sort((a, b) => a.ID - b.ID).toString()

        for (let gr of rs) {
          if (gr.ID === '-1' || gr.ID === '-2') {
            newRs.push(gr)
          } else {
            if (data.some(x => x.ID === gr.ID)) {
              newRs.push(gr)
            }
          }
        }
        for (let gr of data) {
          if (newRs.findIndex(x => x.ID === gr.ID) === -1) {
            newRs.push({ ...gr, Value: 0, Point: 0 })
          }
        }

        if (!isUpdate) {
          UpdateConfig(newRs)
        }

        setValue('ConfigsPoint', newRs)
      } else {
        let newConfigsPoint = [
          {
            ID: '-2',
            Title: 'Quy đổi điểm thưởng',
            Value: 0,
            Point: 0
          },
          {
            ID: '-1',
            Title: 'Chung',
            Value: 0,
            Point: 0
          }
        ].concat(data ? data.map(x => ({ ...x, Value: 0, Point: 0 })) : [])
        setValue('ConfigsPoint', newConfigsPoint)
      }
    }
  }, [ConfigsPoint.data, data]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveMutation = useMutation({
    mutationFn: body => ConfigAPI.saveName(body)
  })

  const onSubmit = ({ ConfigsPoint }) => {
    saveMutation.mutate(
      {
        name: 'tichdiemconfig',
        body: JSON.stringify(ConfigsPoint)
      },
      {
        onSuccess: () => {
          toast.success('Cập nhập thành công.')
        }
      }
    )
  }

  const UpdateConfig = dataPost => {
    saveMutation.mutate({
      name: 'tichdiemconfig',
      body: JSON.stringify(dataPost)
    })
  }

  const columns = useMemo(
    () => [
      {
        key: 'Title',
        title: 'Nhóm khách hàng',
        dataKey: 'Title',
        width: 400,
        sortable: false
      },
      {
        key: 'Value',
        title: 'Giá trị',
        dataKey: 'Value',
        width: 350,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`ConfigsPoint[${rowIndex + 1}].Value`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={true}
                  value={field.value}
                  placeholder="Nhập số tiền"
                  onValueChange={val => field.onChange(val.floatValue || '')}
                />
              )}
            />
          </div>
        )
      },
      {
        key: 'Point',
        title: 'Điểm',
        dataKey: 'Point',
        width: 350,
        sortable: false,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`ConfigsPoint[${rowIndex + 1}].Point`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <InputNumber
                  thousandSeparator={false}
                  value={field.value}
                  placeholder="Nhập số điểm"
                  onValueChange={val => field.onChange(val.floatValue || '')}
                />
              )}
            />
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex flex-col h-full p-4 mx-auto lg:px-8 lg:pt-8 lg:pb-5 max-w-7xl"
    >
      <div className="flex items-center mb-5">
        <div
          onClick={() => {
            window.top.location.href = '/admin/?mdl25=memberconfig'
          }}
          className="flex items-center cursor-pointer"
        >
          <div className="w-10">
            <ChevronLeftIcon className="w-8" />
          </div>
          <div className="text-xl font-bold sm:text-3xl dark:text-white">
            Cài đặt tích điểm
          </div>
        </div>
      </div>
      <ReactBaseTable
        wrapClassName="grow"
        rowKey="id"
        columns={columns || []}
        data={fields ? fields.filter(field => field.ID !== '-2') : []}
        rowHeight={80}
        rowClassName={({ rowIndex }) => {
          return rowIndex === -1 && '!bg-dangerlight'
        }}
        emptyRenderer={() =>
          !isLoading &&
          ConfigsPoint.isLoading && (
            <div className="flex items-center justify-center h-full">
              Không có dữ liệu.
            </div>
          )
        }
        loading={isLoading || ConfigsPoint.isLoading}
        frozenData={fields && fields.length > 0 ? [fields[0]] : []}
      />
      <div className="flex justify-end mt-5">
        <Button
          disabled={saveMutation.isLoading}
          loading={saveMutation.isLoading}
          type="submit"
          className="relative flex items-center h-12 px-4 mr-2 font-medium text-white transition rounded shadow-lg bg-success hover:bg-successhv focus:outline-none focus:shadow-none disabled:opacity-70"
        >
          Lưu cài đặt
        </Button>
      </div>
    </form>
  )
}

export default SettingsPoint
