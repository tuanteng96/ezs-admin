import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const BtnCancelOrder = ({ className, Order, OrderID, children }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const orderCancelMutation = useMutation({
    mutationFn: body => OrdersAPI.orderCancel(body)
  })

  const onOrderCancel = () => {
    Swal.fire({
      customClass: {
        confirmButton: 'bg-danger'
      },
      title: 'Xác nhận hủy đơn ?',
      html: `Bạn chắc chắn muốn khóa hủy đơn hàng này ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        var bodyFormData = new FormData()
        bodyFormData.append('cmd', 'ORDER_CANCEL')
        bodyFormData.append('OrderID', OrderID)
        const { data } = await orderCancelMutation.mutateAsync(bodyFormData)
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(result => {
      if (result.isConfirmed) {
        if (!result?.value?.error) {
          queryClient
            .invalidateQueries({ queryKey: ['Notifications'] })
            .then(() => {
              toast.success('Hủy đơn hàng thành công.')
              navigate(`/clients/${Order?.Member?.ID}/order/${Order?.ID}`, {
                state: {
                  previousPath: `/clients/${Order?.Member?.ID}`
                }
              })
            })
        } else {
          toast.error('Xảy ra lỗi không xác định.')
        }
      }
    })
  }
  return (
    <div className={className} onClick={onOrderCancel}>
      {children}
    </div>
  )
}

BtnCancelOrder.propTypes = {
  className: PropTypes.string
}

export { BtnCancelOrder }
