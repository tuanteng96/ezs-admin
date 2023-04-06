import React from 'react'
import Select from 'react-select'
import { useQuery } from '@tanstack/react-query'
import MembersAPI from 'src/_ezs/api/members.api'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

const SelectMembers = ({
  value,
  StockID = 0,
  isSome = false,
  errorMessage,
  errorMessageForce,
  ...props
}) => {
  const ListMembers = useQuery({
    queryKey: ['ListMemberSelect'],
    queryFn: async () => {
      const data = await MembersAPI.memberSelect({
        Key: '',
        StockID: StockID || 0
      })
      let newData = []
      if (data?.data?.data) {
        for (let key of data?.data?.data) {
          const { StockTitle, StockID, text, id } = key
          const index = newData.findIndex(item => item.StockID === StockID)
          if (index > -1) {
            newData[index].options.push({
              label: text,
              value: id,
              ...key,
              Thumbnail: toAbsoluteUrl('/assets/images/user/blank.png')
            })
          } else {
            const newItem = {}
            newItem.label = StockTitle || 'Khác'
            newItem.StockID = StockID
            newItem.options = [
              {
                label: text,
                value: id,
                ...key,
                Thumbnail: toAbsoluteUrl('/assets/images/user/blank.png')
              }
            ]
            newData.push(newItem)
          }
        }
      }
      return {
        data: newData,
        dataList:
          data?.data?.data?.length > 0
            ? data?.data?.data.map(x => ({ ...x, value: x.id, label: x.text }))
            : []
      }
    },
    onSuccess: () => {}
  })

  return (
    <>
      <Select
        key={StockID}
        isLoading={ListMembers.isLoading}
        value={
          isSome
            ? ListMembers?.data?.dataList &&
              ListMembers?.data?.dataList.length > 0
              ? ListMembers?.data?.dataList.filter(
                  x => value && value.some(k => k === x.value)
                )
              : null
            : value
        }
        classNamePrefix="select"
        options={ListMembers?.data?.data || []}
        placeholder="Chọn khách hàng"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </>
  )
}

export { SelectMembers }
