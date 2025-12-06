import { useMutation, useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import InvoiceAPI from 'src/_ezs/api/invoice.api'
import { Button } from 'src/_ezs/partials/button'
import { Input, InputTextarea } from 'src/_ezs/partials/forms'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'

const schemaAdd = yup
  .object({
    CompanyName: yup.string().required('Vui lòng nhập tên công ty'),
    CompanyTaxCode: yup.string().required('Vui lòng nhập mã số thuế công ty'),
    CompanyAddress: yup.string().required('Vui lòng nhập địa chỉ công ty')
  })
  .required()

function formatExpire(expireTime) {
  const m = moment(expireTime)

  // Nếu giờ === 23 → set 23:00
  if (m.hour() === 23) {
    m.minute(0).second(0) // đưa phút/giây về 00
  }

  return m.format('HH:mm DD/MM/YYYY')
}

function EInvoice() {
  const { id, timestamp } = useParams()
  const [expired, setExpired] = useState(false)

  const intervalRef = useRef(null)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      CompanyName: '',
      CompanyTaxCode: '',
      CompanyAddress: '',
      CompanyEmail: ''
    },
    resolver: yupResolver(schemaAdd)
  })

  // Format timestamp
  const createdAt = Number(timestamp)
  const expireTime = createdAt + 3 * 60 * 60 * 1000

  let { data, isLoading, refetch } = useQuery({
    queryKey: ['EInvoice', id],
    queryFn: async () => {
      let { data } = await InvoiceAPI.orderCompany(
        JSON.stringify({
          OrderID: id.split('-')[0]
        })
      )
      return data
    },
    enabled: Boolean(id)
  })

  useEffect(() => {
    // Clear interval nếu đang chạy
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Nếu không có param => expired
    if (!id || !timestamp || (data && !data.CreateDate)) {
      setExpired(true)
      return
    }

    // Nếu data đã load và timestamp không trùng => expired

    if (
      data?.CreateDate &&
      moment(data.CreateDate).valueOf() !== Number(timestamp)
    ) {
      setExpired(true)
      return
    }

    function checkExpire() {
      const now = Date.now()

      if (now >= expireTime) {
        setExpired(true)
        return null
      }

      const timeLeft = expireTime - now

      if (timeLeft <= 10 * 60 * 1000) return 60 * 1000 // <10 phút → 1 phút check
      return Math.floor(timeLeft / 3)
    }

    let intervalTime = checkExpire()
    if (intervalTime === null) return

    intervalRef.current = setInterval(() => {
      const nextTime = checkExpire()

      // Nếu hết hạn hoặc sai timestamp => dừng interval
      if (nextTime === null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, intervalTime)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [expireTime, id, timestamp, data])

  const updateMutation = useMutation({
    mutationFn: async body => {
      let rs = await InvoiceAPI.orderCompany(body)
      await refetch()
      return rs
    }
  })

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl py-8 px-6 max-w-md text-center border border-gray-200">
          <div className="flex justify-center mb-5 text-[64px] leading-[70px] animate-ring-bell">
            ⏰
          </div>

          <div className="font-bold text-gray-800 mb-2 uppercase">
            Liên kết hóa đơn đã hết hạn
          </div>

          <div className="text-gray-600 text-sm leading-relaxed">
            Hệ thống nhập thông tin hóa đơn hết hiệu lực sau 120 phút kể từ khi
            thanh toán và không muộn hơn 23:00 cùng ngày.
          </div>
        </div>
      </div>
      // <div>
      //   <div>⏰</div>
      //   <div>Liên kết hóa đơn đã hết hạn.</div>
      // </div>
    )
  }

  if (isLoading) return <div className="p-4">Đang tải ...</div>

  if (data?.InvoiceInfo?.CompanyName && data?.InvoiceInfo?.CompanyTaxCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl py-8 px-6 max-w-md text-center border border-gray-200">
          <div className="flex justify-center mb-5 text-[50px] leading-[70px]">
            📄
          </div>

          <div className="font-bold text-gray-800 mb-2 uppercase">
            Hoá đơn đã được cập nhật
          </div>

          <div className="text-gray-600 text-sm leading-relaxed">
            Thông tin hoá đơn của bạn đã được cập nhật thành công. Bạn có thể
            đóng trang này.
          </div>
        </div>
      </div>
    )
  }

  const onSubmit = values => {
    updateMutation.mutate(
      JSON.stringify({
        OrderID: id.split('-')[0],
        InvoiceInfo: values
      }),
      {
        onSuccess: () => {
          toast.success('Lưu thông tin thành công.')
        }
      }
    )
  }

  return (
    <div className="min-h-full px-4 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl w-full px-4 py-6"
      >
        <div className="text-center mb-4">
          <div className="uppercase font-bold mb-2 text-base">
            Thông tin hoá đơn
          </div>
          <div className="text-sm text-site-muted font-number">
            Bạn vui lòng nhập đầy đủ thông tin hoá đơn công ty bên dưới. Liên
            kết này sẽ hết hạn lúc
            <span className="pl-1">{formatExpire(expireTime)}</span>.
          </div>
        </div>
        <div>
          <div className="mb-3.5">
            <div className="font-medium font-number">Tên công ty</div>
            <div className="mt-1">
              <Controller
                name="CompanyName"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    placeholder="Nhập tên công ty"
                    autoComplete="off"
                    type="text"
                    errorMessageForce={fieldState?.invalid}
                    errorMessage={fieldState?.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="mb-3.5">
            <div className="font-medium font-number">Địa chỉ</div>
            <div className="mt-1">
              <Controller
                name="CompanyAddress"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputTextarea
                    placeholder="Nhập địa chỉ công ty"
                    autoComplete="off"
                    type="text"
                    errorMessageForce={fieldState?.invalid}
                    errorMessage={fieldState?.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="mb-3.5">
            <div className="font-medium font-number">Mã số thuế</div>
            <div className="mt-1">
              <Controller
                name="CompanyTaxCode"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    placeholder="Nhập mã số thuế"
                    autoComplete="off"
                    type="text"
                    errorMessageForce={fieldState?.invalid}
                    errorMessage={fieldState?.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="mb-3.5">
            <div className="font-medium font-number">Email nhận</div>
            <div className="mt-1">
              <Controller
                name="CompanyEmail"
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <Input
                    placeholder="Nhập Email"
                    autoComplete="off"
                    type="text"
                    errorMessageForce={fieldState?.invalid}
                    errorMessage={fieldState?.error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <Button
              loading={updateMutation.isLoading}
              disabled={updateMutation.isLoading}
              type="submit"
              className="relative flex items-center px-4 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv h-11 w-full focus:outline-none focus:shadow-none disabled:opacity-70"
            >
              Lưu thông tin
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EInvoice
