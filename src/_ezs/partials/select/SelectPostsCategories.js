import React from 'react'
import Select, { components } from 'react-select'
import { useQuery } from '@tanstack/react-query'
import PostsAPI from 'src/_ezs/api/posts.api'

const SelectPostsCategories = ({
  value,
  errorMessageForce,
  errorMessage,
  ...props
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ListSelectPostsCategories'],
    queryFn: async () => {
      const { data } = await PostsAPI.categories({
        pi: 1,
        ps: 50,
        filter: {
          ApplicationKey: 'article'
        }
      })

      let newData = []
      let treeFn = (list, index) => {
        for (let item of list) {
          newData.push({
            ...item,
            label: item.Title,
            value: item.ID,
            index: index
          })
          if (item.Children && item.Children.length > 0)
            treeFn(item.Children, index + 1)
        }
      }
      if (data.list && data.list.length > 0) {
        treeFn(data.list, 0)
      }
      return newData
    },
    onSuccess: () => {}
  })

  const CustomOption = ({ children, data, ...props }) => {
    if (data.index > 0) {
      return (
        <components.Option {...props}>
          <div className="flex items-center">
            <div
              className="h-[1px] bg-[#d5d7da] line transition-colors"
              style={{
                width: data.index * 15 + 'px'
              }}
            ></div>
            <div className="flex-1 pl-2">{children}</div>
          </div>
        </components.Option>
      )
    }
    return <components.Option {...props}>{children}</components.Option>
  }

  return (
    <div>
      <Select
        isLoading={isLoading}
        value={value}
        classNamePrefix="select"
        options={data}
        noOptionsMessage={() => 'Không có dữ liệu'}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        components={{ Option: CustomOption }}
        {...props}
      />
      {errorMessage && errorMessageForce && (
        <div className="mt-1.5 text-sm text-danger">{errorMessage}</div>
      )}
    </div>
  )
}

export { SelectPostsCategories }
