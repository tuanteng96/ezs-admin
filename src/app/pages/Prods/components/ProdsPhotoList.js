import { TrashIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { UploadFile } from 'src/_ezs/partials/files'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'

function ProdsPhotoList(props) {
  const { control } = useFormContext()

  const { fields, insert, remove } = useFieldArray({
    control,
    name: 'PhotoList'
  })

  return (
    <>
      {fields &&
        fields.map((item, index) => (
          <div
            className="relative flex items-center justify-center rounded group aspect-square bg-light"
            key={item.id}
          >
            <img className="rounded" src={toAbsolutePath(item.Src)} alt="" />
            <div
              className="absolute flex items-center justify-center invisible w-8 h-8 transition bg-white rounded-full shadow-lg opacity-0 cursor-pointer group-hover:opacity-100 group-hover:visible -top-2 -right-2"
              onClick={() => remove(index)}
            >
              <TrashIcon className="w-5 text-danger" />
            </div>
          </div>
        ))}

      <div>
        <Controller
          name="Thumbnail"
          control={control}
          render={({ field }) => (
            <UploadFile
              className="aspect-square"
              width="w-auto"
              height="h-auto"
              value=""
              onChange={val => insert(0, { Src: val })}
            />
          )}
        />
      </div>
    </>
  )
}

export default ProdsPhotoList
