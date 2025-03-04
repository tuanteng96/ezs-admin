import React, { Fragment, useState } from 'react'
import { Menu, Tab, Transition } from '@headlessui/react'
import clsx from 'clsx'
import {
  PlusCircleIcon,
  EllipsisVerticalIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQuery } from '@tanstack/react-query'
import BusinessAPI from 'src/_ezs/api/business.api'
import Swal from 'sweetalert2'
import BannersAPI from 'src/_ezs/api/banners.api'
import { toast } from 'react-toastify'
import { PickerBusiness, PickerBusinessMore } from './components'
import { useRoles } from 'src/_ezs/hooks/useRoles'

function BusinessEstablishment(props) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { kho } = useRoles(['kho'])

  let { data, isLoading, refetch } = useQuery({
    queryKey: ['BusinessEstablishment'],
    queryFn: async () => {
      let { data: Business } = await BusinessAPI.get()
      let { data: BusinessMore } = await BusinessAPI.getMore('APP.COSO')

      let Tabs = [
        {
          Type: 0,
          Title: 'Cơ sở / Chi nhánh',
          Items: [],
          MaxStockCount: null
        },
        {
          Type: 1,
          Title: 'Cơ sở khác',
          Items: [],
          MaxStockCount: null
        }
      ]
      if (Business) {
        Tabs[0].MaxStockCount = Business?.appendData?.MaxStockCount || 0
        Tabs[0].Items = Business?.data || []
      }
      if (BusinessMore) {
        Tabs[1].Items = BusinessMore?.data || []
      }

      return Tabs
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async body => {
      let rs = null
      if (body.Type === 1) {
        rs = await BannersAPI.delete(body.data)
      } else {
        rs = await BusinessAPI.delete(body.data)
      }
      await refetch()
      return rs
    }
  })

  const onDelete = ({ Type, Item }) => {
    if (Type === 0 && !kho?.IsStocks) {
      let index = kho?.StockRoles.findIndex(x => x.ID === Item.ID)
      if (index === -1) {
        toast.error('Bạn không có quyền.')
        return
      }
    }
    let dataPost = {
      delete: [Item.ID]
    }
    if (Type === 0) {
      dataPost = new FormData()
      dataPost.append('id', Item.ID)
      dataPost.append('ToStockID', 0)
    }
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xóa cơ sở / Chi nhánh ?',
      html: `Bạn có chắc chắn muốn cơ sở / chi nhánh này? Hành động này không thể được hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện xóa',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const data = await deleteMutation.mutateAsync({
          data: dataPost,
          Type
        })
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (!result?.isDismissed) {
        toast.success('Đã xóa Cơ sở / Chi nhánh.')
      }
    })
  }

  return (
    <div className="w-full max-w-screen-xl px-4 py-10 m-auto">
      <div>
        <div className="text-3xl font-extrabold">Cơ sở / Chi nhánh</div>
        <div className="mt-2">
          Quản lý danh sách cơ sở của chuỗi Spa & Thẩm mỹ viện
        </div>
      </div>
      <div>
        {isLoading && <div>Đang tải ...</div>}
        {!isLoading && (
          <>
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            >
              <Tab.List className="flex gap-1.5 mt-6 mb-8">
                {data.map((tab, index) => (
                  <Tab
                    key={index}
                    className={({ selected }) =>
                      clsx(
                        'px-4 py-2 rounded-3xl text-[14px] font-medium transition-all',
                        selected
                          ? 'bg-black text-white'
                          : 'text-black hover:bg-[#f0f0f0]'
                      )
                    }
                  >
                    {tab.Title}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {data.map((tab, idx) => (
                  <Tab.Panel key={idx}>
                    {tab.Type === 1 && (
                      <div className="inline-flex items-center p-4 mb-6 rounded-lg bg-warninglight text-warning">
                        <ExclamationTriangleIcon className="w-7" />
                        <div className="pl-3 font-medium">
                          Đây là danh sách các cơ sở hiển thị thêm trong phần hệ
                          thống chi nhánh.
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 md:gap-5 xl:grid-cols-3 md:grid-cols-2">
                      {tab.Type ? (
                        <PickerBusinessMore>
                          {({ open }) => (
                            <div
                              className="bg-white border rounded-lg border-[#e5e5e5] p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px]"
                              onClick={open}
                            >
                              <PlusCircleIcon className="mb-1.5 w-7 text-primary" />
                              <div className="font-medium text-primary">
                                Thêm mới
                              </div>
                            </div>
                          )}
                        </PickerBusinessMore>
                      ) : (
                        <PickerBusiness>
                          {({ open }) => (
                            <div
                              className="bg-white border rounded-lg border-[#e5e5e5] p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[190px]"
                              onClick={() => {
                                if (tab.Items.length >= tab.MaxStockCount) {
                                  toast.error('Vui lòng liên hệ mở thêm cơ sở.')
                                } else {
                                  open()
                                }
                              }}
                            >
                              <PlusCircleIcon className="mb-1.5 w-7 text-primary" />
                              <div className="font-medium text-primary">
                                Thêm mới
                              </div>
                              {tab.MaxStockCount && (
                                <div className="mt-2 text-sm font-light text-muted2">
                                  Đã sử dụng {tab.Items.length}/
                                  {tab.MaxStockCount} cơ sở
                                </div>
                              )}
                            </div>
                          )}
                        </PickerBusiness>
                      )}

                      {tab.Items.map((item, i) => (
                        <Fragment key={i}>
                          {tab.Type ? (
                            <PickerBusinessMore initialValues={item}>
                              {({ open }) => (
                                <div className="bg-white border rounded-lg border-[#e5e5e5] p-5 cursor-pointer min-h-[190px] flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-end mb-4">
                                      <BuildingStorefrontIcon className="w-6" />
                                      <div className="flex-1 pl-2 text-[18px] font-semibold truncate">
                                        {item?.ID}.{item?.Title}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted">
                                      {item?.Desc && (
                                        <div className="flex items-start mb-1.5">
                                          <MapPinIcon className="w-5 align-text-bottom mr-1.5" />
                                          {item?.Desc}
                                        </div>
                                      )}
                                      {item?.FileName && (
                                        <div className="flex items-start">
                                          <PhoneIcon className="w-5 align-text-bottom mr-1.5" />
                                          {item?.FileName}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex justify-between mt-5">
                                    <div
                                      className={clsx(
                                        'flex items-center justify-center h-8 px-4 text-[13px] font-medium rounded-3xl',
                                        item.IsPublic
                                          ? 'bg-successlight text-success'
                                          : 'bg-dangerlight text-danger'
                                      )}
                                    >
                                      {item.IsPublic
                                        ? 'Đang hoạt động'
                                        : 'Ngừng hoạt động'}
                                    </div>
                                    <Menu
                                      as="div"
                                      className="relative inline-block text-left"
                                    >
                                      <div>
                                        <Menu.Button className="flex items-center justify-center w-8 h-8">
                                          <EllipsisVerticalIcon className="w-6" />
                                        </Menu.Button>
                                      </div>
                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <Menu.Items className="absolute right-0 mb-2 overflow-hidden origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg bottom-full w-28 ring-1 ring-black/5 focus:outline-none">
                                          <div className="py-2">
                                            <Menu.Item>
                                              {({ active }) => (
                                                <button
                                                  onClick={open}
                                                  className="w-full px-3.5 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition"
                                                >
                                                  Chỉnh sửa
                                                </button>
                                              )}
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) => (
                                                <button
                                                  className="w-full px-3.5 py-2.5 text-sm text-left hover:bg-[#f2f2f7] text-danger transition"
                                                  onClick={() =>
                                                    onDelete({
                                                      Type: tab.Type,
                                                      Item: item
                                                    })
                                                  }
                                                >
                                                  Xoá
                                                </button>
                                              )}
                                            </Menu.Item>
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </Menu>
                                  </div>
                                </div>
                              )}
                            </PickerBusinessMore>
                          ) : (
                            <PickerBusiness initialValues={item}>
                              {({ open }) => (
                                <div className="bg-white border rounded-lg border-[#e5e5e5] p-5 cursor-pointer min-h-[200px] flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-end mb-4">
                                      <BuildingStorefrontIcon className="w-6" />
                                      <div className="flex-1 pl-2 text-[18px] font-semibold truncate">
                                        {item?.ID}.{item?.Title}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted">
                                      {item?.Desc && (
                                        <div className="flex items-start mb-1.5">
                                          <MapPinIcon className="w-5 align-text-bottom mr-1.5" />
                                          {item?.Desc}
                                        </div>
                                      )}
                                      {item?.LinkSEO && (
                                        <div className="flex items-start">
                                          <PhoneIcon className="w-5 align-text-bottom mr-1.5" />
                                          {item?.LinkSEO}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex justify-between mt-5">
                                    <div
                                      className={clsx(
                                        'flex items-center justify-center h-8 px-4 text-[13px] font-medium rounded-3xl',
                                        item.IsPublic
                                          ? 'bg-successlight text-success'
                                          : 'bg-dangerlight text-danger'
                                      )}
                                    >
                                      {item.IsPublic
                                        ? 'Đang hoạt động'
                                        : 'Ngừng hoạt động'}
                                    </div>
                                    <Menu
                                      as="div"
                                      className="relative inline-block text-left"
                                    >
                                      <div>
                                        <Menu.Button className="flex items-center justify-center w-8 h-8">
                                          <EllipsisVerticalIcon className="w-6" />
                                        </Menu.Button>
                                      </div>
                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <Menu.Items className="absolute right-0 mb-2 overflow-hidden origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg bottom-full w-28 ring-1 ring-black/5 focus:outline-none">
                                          <div className="py-2">
                                            <Menu.Item>
                                              {({ active }) => (
                                                <button
                                                  onClick={() => {
                                                    if (!kho?.IsStocks) {
                                                      let index =
                                                        kho?.StockRoles.findIndex(
                                                          x => x.ID === item.ID
                                                        )
                                                      if (index === -1) {
                                                        toast.error(
                                                          'Bạn không có quyền.'
                                                        )
                                                        return
                                                      }
                                                    }
                                                    open()
                                                  }}
                                                  className="w-full px-3.5 py-2.5 text-sm text-left hover:bg-[#f2f2f7] transition"
                                                >
                                                  Chỉnh sửa
                                                </button>
                                              )}
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) => (
                                                <button
                                                  className="w-full px-3.5 py-2.5 text-sm text-left hover:bg-[#f2f2f7] text-danger transition"
                                                  onClick={() =>
                                                    onDelete({
                                                      Type: tab.Type,
                                                      Item: item
                                                    })
                                                  }
                                                >
                                                  Xoá
                                                </button>
                                              )}
                                            </Menu.Item>
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </Menu>
                                  </div>
                                </div>
                              )}
                            </PickerBusiness>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </>
        )}
      </div>
    </div>
  )
}

export default BusinessEstablishment
