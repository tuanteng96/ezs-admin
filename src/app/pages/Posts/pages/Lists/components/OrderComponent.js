import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import PostsAPI from 'src/_ezs/api/posts.api'
import { InputNumber } from 'src/_ezs/partials/forms'

function OrderComponent({ rowData }) {
  const [value, setValue] = useState(rowData?.Order)

  const queryClient = useQueryClient()

  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    setValue(rowData?.Order)
  }, [rowData])

  const editMutation = useMutation({
    mutationFn: body => PostsAPI.edit(body)
  })

  const onChange = e => {
    setValue(e)

    let values = {
      arr: [
        {
          ID: rowData?.ID,
          Order: e
        }
      ]
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      editMutation.mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['ListPosts'] })
        }
      })
    }, 500)
  }

  return (
    <div className="w-full">
      <InputNumber
        className="px-3.5 py-3 font-medium placeholder:font-normal text-center"
        placeholder="Thứ tự"
        autoComplete="off"
        value={value}
        onValueChange={val => onChange(val.floatValue || '')}
        allowNegative={false}
      />
    </div>
  )
}

export default OrderComponent
