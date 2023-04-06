import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import Swal from 'sweetalert2'

const BtnDebtLock = ({ className, OrderID, children }) => {
  const queryClient = useQueryClient()
  const orderDebtLockMutation = useMutation({
    mutationFn: body => OrdersAPI.orderEndPay(body)
  })

  const onOrderDebtLock = () => {
    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Xác nhận khóa nợ ?',
      html: `Bạn chắc chắn muốn khóa nợ đơn hàng này ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const { data } = await orderDebtLockMutation.mutateAsync({
          OrderID: OrderID
        })
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        if (!result?.value?.data?.error) {
          queryClient
            .invalidateQueries({ queryKey: ['MemberListPay'] })
            .then(() => {
              toast.success('Khóa nợ đơn hàng thành công.')
            })
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }
  return (
    <div className={className} onClick={onOrderDebtLock}>
      {children}
    </div>
  )
}

BtnDebtLock.propTypes = {
  className: PropTypes.string
}

export { BtnDebtLock }
