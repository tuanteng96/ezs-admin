import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import UploadsAPI from 'src/_ezs/api/uploads.api'
import { toast } from 'react-toastify'

function Thumbnail({ value, onChange }) {
  const uploadMutation = useMutation({
    mutationFn: body => UploadsAPI.sendFile(body)
  })

  const handleFile = event => {
    const files = event.target.files
    var bodyFormData = new FormData()
    bodyFormData.append('file', files[0])

    uploadMutation.mutate(bodyFormData, {
      onSuccess: ({ data }) => {
        if (data?.error) {
          toast.error(data.error)
        } else {
          onChange(
            (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
              ? process.env.REACT_APP_API_URL
              : window.location.origin) +
              '/upload/image/' +
              data.data
          )
        }
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <div className="flex items-end">
      <div className="relative">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-32 h-32 border-[1px] border-gray-300 border-dashed rounded-lg cursor-pointer"
        >
          {value && (
            <div>
              <img className="w-full" src={value} alt="Hình ảnh" />
            </div>
          )}
          {!value && (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <div className="text-[11px] text-muted mt-1">Upload hình ảnh</div>
            </div>
          )}

          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {value && (
          <div
            className="absolute bg-white shadow-xl rounded-full w-6 h-6 flex items-center justify-center text-muted -top-[10px] -right-[10px] cursor-pointer"
            onClick={() => onChange('')}
          >
            <XMarkIcon className="w-5" />
          </div>
        )}
      </div>
      {value && (
        <div className="pl-5 text-primary text-sm cursor-pointer">
          Chỉnh sửa ảnh
        </div>
      )}
    </div>
  )
}

export default Thumbnail
