import React, { useEffect } from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import ConfigAPI from 'src/_ezs/api/config'
import { Controller, useFormContext } from 'react-hook-form'

function SelectUserLevels({
  errorMessage,
  errorMessageForce,
  onSuccess,
  name,
  label,
  wrapClassName,
  ...props
}) {
  const { control } = useFormContext()

  const { data, isLoading } = useQuery({
    queryKey: ['ListLevels'],
    queryFn: async () => {
      const { data } = await ConfigAPI.getName('user.levels')
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

  useEffect(() => {
    onSuccess && onSuccess(data || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (!data || data.length === 0) return <></>

  return (
    <div className={wrapClassName}>
      <div className="font-semibold">{label}</div>
      <div className="mt-1">
        <Controller
          name={name}
          control={control}
          render={({ field: { ref, ...field }, fieldState }) => (
            <>
              <Select
                isLoading={isLoading}
                classNamePrefix="select"
                options={data || []}
                value={data ? data.filter(x => x.value === field.value) : null}
                onChange={val => field.onChange(val?.value || '')}
                placeholder="Chọn cấp bậc"
                noOptionsMessage={() => 'Không có dữ liệu'}
                {...props}
              />
              {errorMessage && errorMessageForce && (
                <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
              )}
            </>
          )}
        />
      </div>
    </div>
  )
}

export { SelectUserLevels }
