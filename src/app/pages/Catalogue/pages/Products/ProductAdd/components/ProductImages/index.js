import { TrashIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { UploadFile } from 'src/_ezs/partials/files'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'

function ProductImages(props) {
  const { control } = useFormContext()

  const { fields, insert, remove } = useFieldArray({
    control,
    name: 'Images'
  })

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {fields &&
        fields.map((item, index) => (
          <div
            className="group aspect-square bg-light rounded flex justify-center items-center relative"
            key={item.id}
          >
            <img className="rounded" src={toAbsolutePath(item.Src)} alt="" />
            <div
              className="w-8 h-8 opacity-0 group-hover:opacity-100 transition invisible group-hover:visible absolute rounded-full -top-2 -right-2 bg-white shadow-lg flex justify-center items-center cursor-pointer"
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
    </div>
  )
}

export { ProductImages }
