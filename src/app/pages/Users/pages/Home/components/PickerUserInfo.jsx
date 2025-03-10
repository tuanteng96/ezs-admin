import React, { useState } from 'react'
import { m } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from 'src/_ezs/partials/button'
import { FloatingPortal } from '@floating-ui/react'
import copy from 'copy-html-to-clipboard'
import { useQuery } from '@tanstack/react-query'
import ConfigAPI from 'src/_ezs/api/config'
import { toast } from 'react-toastify'

function PickerUserInfo({ children, values }) {
  const [visible, setVisible] = useState(false)
  const [initialValues, setInitialValues] = useState(values)

  const { data } = useQuery({
    queryKey: ['BrandNameInfo'],
    queryFn: async () => {
      let { data } = await ConfigAPI.getName('Bill.Title')
      return data?.data && data?.data.length > 0 ? data?.data[0].Value : null
    },
    enabled: visible
  })

  const onHide = () => {
    setVisible(false)
  }

  const onCopy = () => {
    let str = `
      Xin Chào, 
Đây là thông tin khởi tạo của bạn, vui lòng lưu trữ trong suốt thời gian bạn làm việc tại ${data}. 
Thông tin đăng nhập của nhân viên ${initialValues?.FullName} 
- Tài khoản: ${initialValues?.UserName} 
- Mật khẩu: 1234 ( Sau khi đăng nhập bắt buộc đổi mật khẩu ) 

B. Cài đặt APP tự quản lý trên Smartphone 
- Tải APP IDEZS tại APP STORE hoặc CH PLAY 
- Thông tin đăng nhập   
Tên miền ${window.location.hostname} 
Tài khoản & Mật khẩu như trên ( trường hợp quên liên hệ quản lý để được cấp lại ) 

C. Hướng dẫn sử dụng nhanh 
C1. Chấm công  
- Chấm công hàng ngày: https://youtube.com 
- Xử lý tình huống:  
Kết nối đúng wifi không vẫn không chấm công được: https://youtube.com  
Nhận được thông báo tài khoản đã đăng nhập ở thiết bị khác: https://youtube.com 
Quên mật khẩu đăng nhập: https://youtube.com  
C2. Thống kê hàng ngày  
- Thông tin chấm công, Lương tour, Hoa hồng, doanh số https://youtube.com  
(Trường hợp có sai xót vui lòng thông báo ngay với quản lý cơ sở)  
C3. Nhận giao ca ( Nếu bạn là Kỹ thuật viên ) : https://youtube.com
    `

    copy(str, {
      asHtml: true
    })

    toast.success('Đã Copy thông tin.')
  }

  return (
    <>
      {children({
        open: v => {
          if (v) setInitialValues(v)
          setVisible(true)
        }
      })}
      {visible && (
        <FloatingPortal root={document.body}>
          <div className="fixed inset-0 flex items-center justify-center z-[1003]">
            <m.div
              className="absolute inset-0 bg-black/[.2] dark:bg-black/[.4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onHide}
            ></m.div>
            <m.div
              className="absolute flex flex-col justify-center h-full py-8 px-4 sm:px-0 w-[500px] max-w-full"
              initial={{ opacity: 0, top: '60%' }}
              animate={{ opacity: 1, top: 'auto' }}
              exit={{ opacity: 0, top: '60%' }}
            >
              <div className="flex flex-col max-h-full bg-white rounded shadow-lg dark:bg-dark-aside">
                <div className="relative flex justify-between px-5 py-4 border-b border-separator dark:border-dark-separator">
                  <div className="text-2xl font-bold">Thông tin đăng nhập</div>
                  <div
                    className="absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4"
                    onClick={onHide}
                  >
                    <XMarkIcon className="w-8" />
                  </div>
                </div>
                <div className="p-5 overflow-auto grow">
                  <div className="mb-1 font-semibold">Xin chào, </div>
                  <div className="font-light">
                    Đây là thông tin tài khoản, vui lòng lưu trữ trong suốt thời
                    gian bạn làm việc tại
                    <span className="pl-1 font-semibold text-primary">
                      {data}
                    </span>
                  </div>
                  <div className="mt-4 font-light">
                    <div className="mb-1.5 font-semibold">
                      A. Thông tin đăng nhập của nhân viên
                      <span className="pl-1">{initialValues?.FullName}</span>
                    </div>
                    <div className="mb-px">
                      - Tài khoản
                      <span className="pl-1 font-semibold">
                        {initialValues?.UserName}
                      </span>
                    </div>
                    <div>
                      - Mật khẩu
                      <span className="pl-1 font-semibold">1234</span> (Sau khi
                      đăng nhập bắt buộc đổi mật khẩu )
                    </div>
                  </div>
                  <div className="mt-4 font-light">
                    <div className="mb-1.5 font-semibold">
                      B. Cài đặt APP tự quản lý trên Smartphone
                      <span className="pl-1">{initialValues?.FullName}</span>
                    </div>
                    <div className="mb-px">
                      - Tài APP
                      <span className="px-1 font-semibold text-primary">
                        IDEZS
                      </span>
                      tại <span className="font-semibold">CH PLAY</span> hoặc
                      <span className="pl-1 font-semibold">APP STORE</span>
                    </div>
                    <div>
                      - Tên miền
                      <span className="px-1 font-semibold text-primary">
                        {window.location.hostname}
                      </span>
                      (Sau khi đăng nhập bắt buộc đổi mật khẩu )
                    </div>
                    <div className="mt-1 italic text-muted2">
                      Tài khoản & Mật khẩu như trên ( trường hợp quên liên hệ
                      quản lý để được cấp lại )
                    </div>
                  </div>
                  <div className="mt-4 font-light">
                    <div className="mb-1.5 font-semibold">
                      C. Hướng dẫn sử dụng nhanh
                    </div>
                    <div className="pl-4">
                      <div className="mb-2 last:mb-0">
                        <div className="italic font-medium mb-1.5">
                          C1. Chấm công
                        </div>
                        <div className="mb-px">
                          - Chấm công hàng ngày
                          <span
                            className="px-1 font-medium cursor-pointer text-primary"
                            onClick={() =>
                              window.top
                                .open('https://youtube.com', '_blank')
                                .focus()
                            }
                          >
                            https://youtube.com
                          </span>
                        </div>
                        <div className="mt-1 italic text-muted2">
                          <div>
                            Kết nối đúng WIFI nhưng vẫn không thể chấm công
                            <span
                              className="px-1 font-medium cursor-pointer text-primary"
                              onClick={() =>
                                window.top
                                  .open('https://youtube.com', '_blank')
                                  .focus()
                              }
                            >
                              https://youtube.com
                            </span>
                          </div>
                          <div>
                            <div>
                              Nhận được thông báo tài khoản đã đăng nhập ở thiết
                              bị khác
                              <span
                                className="px-1 font-medium cursor-pointer text-primary"
                                onClick={() =>
                                  window.top
                                    .open('https://youtube.com', '_blank')
                                    .focus()
                                }
                              >
                                https://youtube.com
                              </span>
                            </div>
                          </div>
                          <div>
                            <div>
                              Quên mật khẩu đăng nhập
                              <span
                                className="px-1 font-medium cursor-pointer text-primary"
                                onClick={() =>
                                  window.top
                                    .open('https://youtube.com', '_blank')
                                    .focus()
                                }
                              >
                                https://youtube.com
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 last:mb-0">
                        <div className="italic font-medium mb-1.5">
                          C2. Thống kê hàng ngày
                        </div>
                        <div className="mb-2">
                          - Thông tin chấm công, Lương tour, Hoa hồng, doanh số
                          <span
                            className="px-1 font-medium cursor-pointer text-primary"
                            onClick={() =>
                              window.top
                                .open('https://youtube.com', '_blank')
                                .focus()
                            }
                          >
                            https://youtube.com
                          </span>
                        </div>
                        <div className="text-sm italic text-danger">
                          (*) Trường hợp có sai xót vui lòng thông báo ngay với
                          quản lý cơ sở.
                        </div>
                      </div>
                      <div className="mb-2 last:mb-0">
                        <div className="italic font-medium mb-1.5">
                          C3. Nhận giao ca ( Nếu bạn là Kỹ thuật viên )
                        </div>
                        <div>
                          <span
                            className="font-medium cursor-pointer text-primary"
                            onClick={() =>
                              window.top
                                .open('https://youtube.com', '_blank')
                                .focus()
                            }
                          >
                            https://youtube.com
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-5 border-t border-separator dark:border-dark-separator">
                  <Button
                    type="button"
                    className="relative flex items-center px-4 ml-2 font-semibold text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 focus:outline-none focus:shadow-none disabled:opacity-70"
                    onClick={() => onCopy()}
                  >
                    Copy thông tin
                  </Button>
                  <Button
                    onClick={onHide}
                    type="button"
                    className="relative flex items-center px-4 font-bold transition border border-gray-300 rounded shadow-lg dark:border-gray-700 h-11 hover:border-gray-800 focus:outline-none focus:shadow-none"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </m.div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

export default PickerUserInfo
