import { useMutation } from '@tanstack/react-query'
import React, { useRef } from 'react'
import AsyncSelect from 'react-select/async'
import ProdsAPI from 'src/_ezs/api/prods.api'

const SelectProdService = ({ value, name, StockID = 0, ...props }) => {
  const typingTimeoutRef = useRef(null)
  const getListServiceMutation = useMutation({
    mutationFn: body => ProdsAPI.getListService(body)
  })

  const promiseOptions = (inputValue, callback) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(async () => {
      const { data } = await getListServiceMutation.mutateAsync({
        Key: inputValue,
        Pi: 1,
        Ps: 500,
        StockID: StockID
      })
      callback(
        data?.lst
          ? data?.lst.map(x => ({ ...x, label: x.Title, value: x.ID }))
          : []
      )
    }, 500)
  }
  return (
    <div>
      <AsyncSelect
        key={StockID}
        noOptionsMessage={() => 'Không có dữ liệu'}
        placeholder="Chọn dịch vụ"
        classNamePrefix="select"
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        value={value}
        {...props}
      />
    </div>
  )
}

export { SelectProdService }
