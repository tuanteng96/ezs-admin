import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import ConfigAPI from 'src/_ezs/api/config'
import clsx from 'clsx'

function SelectMeasure({ value, errorMessageForce, errorMessage, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListMeasure'],
    queryFn: async () => {
      const { data } = await ConfigAPI.getName('STOCK_UNITS')
      let result = []
      if (data.data && data.data.length > 0) {
        result = data.data[0].Value.split(',').map(x => ({
          label: x,
          value: x
        }))
      }
      return result
    }
  })

  return (
    <div>
      <Select
        value={data && data.filter(x => x.value === value)}
        isLoading={isLoading}
        classNamePrefix="select"
        className={clsx(
          'select-control',
          errorMessageForce && 'select-control-error'
        )}
        options={data || []}
        placeholder="Chọn đơn vị"
        {...props}
      />
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectMeasure }
