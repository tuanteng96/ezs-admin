import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import OrdersAPI from 'src/_ezs/api/orders'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import MembersAPI from 'src/_ezs/api/members.api'

const BtnFinishCreateMember = ({ className, OrderID, Member, children }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const orderCreateMemberMutation = useMutation({
    mutationFn: body => MembersAPI.memberAddFast(body)
  })

  const orderChangeMemberMutation = useMutation({
    mutationFn: body => OrdersAPI.orderChangeMember(body)
  })

  const orderPassersbyMutation = useMutation({
    mutationFn: body => OrdersAPI.orderFinish(body)
  })

  const onOrderPassersby = () => {
    Swal.fire({
      customClass: {
        confirmButton: 'bg-success'
      },
      title: 'Xác nhận hoàn thành ?',
      html: `Bạn chắc chắn hoàn thành đơn hàng và tạo khách hàng mới ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thực hiện',
      cancelButtonText: 'Đóng',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const resultMember = await orderCreateMemberMutation.mutateAsync({
          member: {
            FullName: Member?.SenderName,
            MobilePhone: Member?.SenderPhone,
            IsAff: 1
          }
        })
        await orderChangeMemberMutation.mutateAsync({
          memberid: resultMember?.data?.member?.ID,
          orderid: OrderID
        })
        const { data } = await orderPassersbyMutation.mutateAsync({
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
    <div className={className} onClick={onOrderPassersby}>
      {children}
    </div>
  )
}

BtnFinishCreateMember.propTypes = {
  className: PropTypes.string
}

export { BtnFinishCreateMember }
