import clsx from 'clsx'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from 'src/_ezs/core/Auth'
import { useClientView } from './ClientViewContext'

const ClientViewContent = ({ children }) => {
  const { MemberView } = useClientView()
  const { CrStocks } = useAuth()

  useEffect(() => {
    if (MemberView?.CheckIn && MemberView?.CheckIn?.StockID !== CrStocks?.ID) {
      toast.warning(
        `Khách hàng đang CHECK IN tại cơ sở ${MemberView?.CheckIn?.StockTitle}. Vui lòng thay đổi cơ sở.`,
        {
          autoClose: 3000
        }
      )
    }
  }, [MemberView, CrStocks])

  return (
    <div
      className={clsx(
        'flex h-full',
        MemberView?.CheckIn &&
          MemberView?.CheckIn?.StockID !== CrStocks?.ID &&
          'pointer-events-none grayscale'
      )}
    >
      {children}
    </div>
  )
}

export { ClientViewContent }
