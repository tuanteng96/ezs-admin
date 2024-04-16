import { Switch } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { Fragment, useEffect, useState } from 'react'
import PostsAPI from 'src/_ezs/api/posts.api'

function IsPublicComponent({ rowData }) {
  const [enabled, setEnabled] = useState(Number(rowData?.IsPublic) === 1)

  const queryClient = useQueryClient()

  useEffect(() => {
    setEnabled(Number(rowData?.IsPublic) === 1)
  }, [rowData])

  const editMutation = useMutation({
    mutationFn: body => PostsAPI.edit(body)
  })

  const onChange = e => {
    setEnabled(e)

    let values = {
      arr: [
        {
          ID: rowData?.ID,
          IsPublic: e ? 1 : 0
        }
      ]
    }

    editMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ListPosts'] })
      }
    })
  }

  return (
    <div className="flex justify-center w-full">
      <Switch checked={enabled} onChange={onChange} as={Fragment}>
        {({ checked }) => (
          <button
            className={clsx(
              'relative inline-flex h-6 w-11 items-center rounded-full transition shadow-lg',
              checked ? 'bg-primary' : 'bg-gray-300'
            )}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={clsx(
                'inline-block h-4 w-4 transform rounded-full bg-white transition',
                checked ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        )}
      </Switch>
    </div>
  )
}

export default IsPublicComponent
