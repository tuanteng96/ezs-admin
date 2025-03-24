import React, { useState, useMemo } from 'react'
import {
  ArrowUpTrayIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import { SelectProds } from 'src/_ezs/partials/select'
import clsx from 'clsx'
import ProdsAPI from 'src/_ezs/api/prods.api'
import { ReactBaseTable } from 'src/_ezs/partials/table'
import { ImageLazy } from 'src/_ezs/partials/images'
import UploadsAPI from 'src/_ezs/api/uploads.api'
import { toast } from 'react-toastify'

const unformatFile = name => {
  if (!name) return
  return name.substr(0, name.lastIndexOf('.'))
}

function PickerSettingsImages({ children }) {
  const [visible, setVisible] = useState(false)

  const methods = useForm({
    defaultValues: {
      files: []
    }
  })

  const { control, handleSubmit, setValue } = methods

  const { fields, update, remove } = useFieldArray({
    control,
    name: 'files'
  })

  const uploadsMutation = useMutation({
    mutationFn: body => UploadsAPI.sendMultiFiles(body)
  })

  const updateMutation = useMutation({
    mutationFn: body => ProdsAPI.updateImageProd(body)
  })

  const allMutation = useMutation({
    mutationFn: body => uploadAll(body)
  })

  const initialMutation = useMutation({
    mutationFn: body => ProdsAPI.searchNamesProd(body)
  })

  const uploadAll = async files => {
    const results = []
    for (const i in files) {
      if (files[i].item) {
        update(files[i].index, {
          ...files[i],
          status: 'pending'
        })

        let formData = new FormData()
        formData.append(files[i].index, files[i].file)

        const { data } = await uploadsMutation.mutateAsync(formData)

        if (data.lst && data.lst.length > 0) {
          let { result } = data.lst[0]
          let body = {
            list: [
              {
                Src: result,
                Type: 'Product',
                Filter: `id=${files[i].item?.value}`,
                Action: 'update'
              }
            ]
          }
          await updateMutation.mutateAsync(body)

          update(files[i].index, {
            ...files[i],
            status: 'finish'
          })
        } else {
          update(files[i].index, {
            ...files[i],
            status: 'error'
          })
        }
        results.push(data)
      } else {
        update(files[i].index, {
          ...files[i],
          status: 'error'
        })
      }
    }

    return results
  }

  const onChooseFile = async e => {
    let { files } = e.target
    if (!files || !files.length === 0) return

    let arr = []

    for (let i = 0; i < files.length; i++) {
      let obj = {
        ID: i + 1,
        index: i,
        file: files[i],
        name: files[i].name,
        nameE: unformatFile(files[i].name),
        item: null,
        Action: 'update',
        blob: URL.createObjectURL(files[i]),
        status: ''
      }
      arr.push(obj)
    }

    let { data } = await initialMutation.mutateAsync({
      list: arr.map(x => x.nameE)
    })

    if (data?.rs && data?.rs.length > 0) {
      for (let key of data?.rs) {
        let index = arr.findIndex(x => x.nameE === key.key)
        if (index > -1 && key.prod) {
          arr[index].item = {
            ...key.prod,
            label: key.prod.Title,
            value: key.prod.ID
          }
        }
      }
    }
    setValue('files', arr)
  }

  const onSubmit = values => {
    let newValues = values?.files ? values?.files.filter(x => x.item) : []
    if (!newValues || newValues.length === 0) return
    allMutation.mutate(values.files || [], {
      onSuccess: () => {
        toast.success('Upload thành công.')
      }
    })
  }

  const columns = useMemo(
    () => [
      {
        key: 'ID',
        title: 'STT',
        dataKey: 'ID',
        width: 100,
        sortable: false
      },
      {
        key: 'blob',
        title: 'Hình ảnh',
        dataKey: 'blob',
        width: 120,
        cellRenderer: ({ rowData }) => (
          <div className="flex justify-center w-full">
            <a target="_blank" href={rowData.blob} rel="noreferrer">
              <ImageLazy
                wrapperClassName="object-cover w-20 h-20 !block"
                className="object-cover w-20 h-20"
                effect="blur"
                src={rowData.blob}
                alt={rowData.name}
              />
            </a>
          </div>
        ),
        sortable: false
      },
      {
        key: 'item',
        title: 'Mặt hàng',
        dataKey: 'item',
        width: 300,
        sortable: false,
        flexGrow: 1,
        cellRenderer: ({ rowIndex }) => (
          <div className="w-full">
            <Controller
              name={`files[${rowIndex}].item`}
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <SelectProds
                  DynamicID
                  cates=""
                  isClearable
                  value={field.value}
                  onChange={val => {
                    field.onChange(val)
                  }}
                  className="select-control"
                  placeholder="Chọn mặt hàng"
                  noOptionsMessage={() => 'Chưa có mặt hàng.'}
                />
              )}
            />
          </div>
        )
      },
      {
        key: 'status',
        title: 'Trạng thái',
        dataKey: 'status',
        width: 180,
        sortable: false,
        cellRenderer: ({ rowData }) => (
          <div
            className={clsx(
              'font-medium',
              rowData?.status === 'pending' && 'text-warning',
              rowData?.status === 'finish' && 'text-success',
              rowData?.status === 'error' && 'text-danger'
            )}
          >
            {rowData?.status === 'pending' && 'Đang upload ...'}
            {rowData?.status === 'finish' && 'Thành công'}
            {rowData?.status === 'error' && 'Lỗi'}
          </div>
        )
      },
      {
        key: 'Action',
        title: '#',
        dataKey: 'Action',
        width: 120,
        cellRenderer: ({ rowData, rowIndex }) => (
          <div className="flex justify-center w-full">
            <button
              type="button"
              className="bg-danger hover:bg-dangerhv text-white mx-[2px] text-sm cursor-pointer p-3 transition rounded"
              onClick={() => remove(rowIndex)}
            >
              <TrashIcon className="w-5" />
            </button>
          </div>
        ),
        sortable: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields]
  )

  const onHide = () => {
    setVisible(false)
  }

  return (
    <>
      {children({
        open: () => setVisible(true)
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col h-full"
            >
              <div
                className="fixed top-0 left-0 z-[1003] bg-white h-full w-full flex flex-col"
                autoComplete="off"
              >
                <div className="relative flex justify-between p-4 border-b md:px-8 md:py-6 border-separator">
                  <div className="flex items-center text-2xl font-semibold md:text-3xl">
                    Cài đặt hình ảnh
                  </div>
                  <Button
                    className="absolute flex items-center justify-center w-12 h-12 transition-all right-6 top-2/4 -translate-y-2/4 opacity-80 hover:opacity-100"
                    onClick={onHide}
                    type="button"
                  >
                    <XMarkIcon className="w-8" />
                  </Button>
                </div>
                <ReactBaseTable
                  wrapClassName="grow p-6 mx-auto max-w-[1440px] w-full"
                  rowKey="id"
                  columns={columns}
                  data={fields || []}
                  estimatedRowHeight={110}
                  emptyRenderer={() => (
                    <div className="flex items-center justify-center h-full">
                      Không có dữ liệu
                    </div>
                  )}
                  loading={false}
                  fixed={false}
                />
                <div className="flex justify-between px-6 pb-6 mx-auto max-w-[1440px] w-full">
                  <div>
                    <div className="flex border border-[#e6e7eb] h-11 rounded bg-white">
                      <div className="flex items-center px-4 min-w-[200px]">
                        {fields && fields.length > 0 && (
                          <>{fields.length} hình ảnh</>
                        )}
                        {(!fields || fields.length === 0) && 'No File Chosen'}
                      </div>
                      <div className="bg-[#f3f3f3] px-4 flex items-center relative cursor-pointer">
                        <ArrowUpTrayIcon className="w-5 mr-2" />
                        {initialMutation.isLoading
                          ? 'Đang thực hiện ...'
                          : 'Chọn files ảnh'}

                        {initialMutation.isLoading && (
                          <svg
                            aria-hidden="true"
                            role="status"
                            className={clsx(
                              'inline w-6 h-6 animate-spin text-primary ml-3'
                            )}
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                        <input
                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                          type="file"
                          multiple
                          onChange={onChooseFile}
                          value=""
                          accept="image/*"
                          disable={initialMutation.isLoading.toString()}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      loading={allMutation.isLoading}
                      disabled={
                        allMutation.isLoading || initialMutation.isLoading
                      }
                      type="submit"
                      className="relative flex items-center px-4 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    >
                      Upload tất cả ảnh
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerSettingsImages
