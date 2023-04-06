import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import Swal from 'sweetalert2'

const BtnDonate = ({ className, OrderID, children }) => {
  const queryClient = useQueryClient()
  const orderDonateMutation = useMutation({
    mutationFn: body => OrdersAPI.orderDonate(body)
  })

  const onOrderDonate = () => {
    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Xác nhận tặng đơn ?',
      html: `Bạn chắc chắn muốn tặng đơn hàng này ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Tặng đơn',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const { data } = await orderDonateMutation.mutateAsync({
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
              toast.success('Tặng đơn hàng thành công.')
            })
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }
  return (
    <div className={className} onClick={onOrderDonate}>
      {children}
    </div>
  )
}

BtnDonate.propTypes = {
  className: PropTypes.string
}

export { BtnDonate }
