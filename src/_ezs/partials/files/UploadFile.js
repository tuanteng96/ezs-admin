/* eslint-disable react/jsx-no-target-blank */
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import UploadsAPI from 'src/_ezs/api/uploads.api'
import { toAbsolutePath, toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

const UploadFile = ({
  value,
  onChange,
  placeholder,
  errorMessage,
  errorMessageForce,
  width = 'w-[160px]',
  height = 'h-[160x]',
  ...props
}) => {
  const [completed, setCompleted] = useState(0)

  const uploadMutation = useMutation({
    mutationFn: body =>
      UploadsAPI.sendFile(body, progress => {
        setCompleted(progress)
      })
  })

  const handleFileChange = event => {
    const files = event.target.files
    var bodyFormData = new FormData()
    bodyFormData.append('file', files[0])

    uploadMutation.mutate(bodyFormData, {
      onSuccess: ({ data }) => {
        if (data?.error) {
          toast.error(data.error)
        } else {
          onChange(data.data)
        }
      },
      onError: error => {
        console.log(error)
      }
    })
  }

  return (
    <>
      <div
        className={clsx(
          'shadow-lg rounded border-4 relative border-white dark:border-dark-separator',
          width,
          height
        )}
      >
        {/* No file */}
        <div
          className={clsx(
            'relative flex flex-col items-center justify-center h-full text-center border border-dashed rounded',
            errorMessageForce
              ? 'border-danger'
              : 'border-separator dark:border-dark-separator'
          )}
        >
          <img
            className="w-8/12"
            src={toAbsoluteUrl('/assets/images/files/no-file.png')}
            alt="No Files"
          />
          <div className="px-2.5 mt-2 text-xs text-gray-500">
            Kéo tệp hoặc nhấp chuột vào đây.
          </div>
          <input
            className="absolute top-0 left-0 z-0 w-full h-full opacity-0 cursor-pointer"
            type="file"
            title=""
            {...props}
            onChange={handleFileChange}
          />
        </div>
        {/* No file */}
        {value && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-100 dark:bg-graydark-100">
            <a
              className="flex items-center justify-center h-full overflow-hidden rounded"
              href={toAbsolutePath(value)}
              target="_blank"
              rel="noopener"
            >
              <img
                className="w-full"
                src={toAbsolutePath(value)}
                alt="Avatar"
              />
            </a>
            <div
              className="absolute z-10 flex items-center justify-center text-gray-700 transition bg-white rounded-full shadow-lg cursor-pointer dark:text-darkgray-800 dark:bg-graydark-200 h-7 w-7 -top-4 -right-4 hover:text-primary"
              onClick={() => onChange('')}
            >
              <XMarkIcon className="w-4" />
            </div>
          </div>
        )}

        {/* Loading */}
        <div
          className={clsx(
            'absolute top-0 right-0 flex items-center justify-center w-full h-full bg-white/90 dark:bg-dark-app/90 z-10 transition',
            uploadMutation.isLoading
              ? 'opacity-1 visible'
              : 'opacity-0 invisible'
          )}
        >
          <div className="flex flex-col items-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-graydark-800 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <div className="mt-3 text-sm text-gray-600 dark:text-graydark-800">
              Đang tải ...{' '}
              <span className="font-medium text-primary">{completed}%</span>
            </div>
          </div>
        </div>
      </div>
      {placeholder && (
        <div className="mt-3 text-xs text-muted font-inter">{placeholder}</div>
      )}
    </>
  )
}

export { UploadFile }
