import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const BtnDeleteOrder = ({ className, Order, OrderID, children }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const orderDeleteMutation = useMutation({
    mutationFn: body => OrdersAPI.orderDelete(body)
  })

  const onOrderDelete = () => {
    Swal.fire({
      customClass: {
        confirmButton: '!bg-danger'
      },
      title: 'Xác nhận xóa đơn hàng?',
      html: `Bạn chắc chắn muốn xóa đơn hàng này. Sẽ không thể khôi phục lại đơn hàng ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const { data } = await orderDeleteMutation.mutateAsync({
          orderid: OrderID
        })
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
              navigate(`/clients/${Order?.Member?.ID}/orders`, {
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
    <div className={className} onClick={onOrderDelete}>
      {children}
    </div>
  )
}

BtnDeleteOrder.propTypes = {
  className: PropTypes.string
}

export { BtnDeleteOrder }
