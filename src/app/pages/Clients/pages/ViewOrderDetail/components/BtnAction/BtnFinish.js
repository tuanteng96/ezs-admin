import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const BtnFinish = ({ className, OrderID, children }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const orderFinishMutation = useMutation({
    mutationFn: body => OrdersAPI.orderFinish(body)
  })

  const onOrderFinish = () => {
    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Xác nhận hoàn thành ?',
      html: `Bạn chắc chắn hoàn thành đơn hàng này ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const { data } = await orderFinishMutation.mutateAsync({
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
              toast.success('Hoàn thành đơn hàng thành công.')
              navigate(
                `/clients/${result?.value?.Order?.Member?.ID}/order/${result?.value?.Order?.ID}`,
                {
                  state: {
                    previousPath: `/clients/${result?.value?.Order?.Member?.ID}`
                  }
                }
              )
            })
        } else {
          toast.error(result?.value?.error)
        }
      }
    })
  }
  return (
    <div className={className} onClick={onOrderFinish}>
      {children}
    </div>
  )
}

BtnFinish.propTypes = {
  className: PropTypes.string
}

export { BtnFinish }
