import React, { forwardRef } from 'react'

const PrinterOs = forwardRef((props, ref) => {
  return (
    <div className="screen:hidden print:block font-inter text-[#000]" ref={ref}>
      <div className="text-center">
        <div className="uppercase font-bold text-xl">Cser Hà Nội</div>
        <div className="text-xs font-semibold">
          <div>22/42 Vũ Ngọc Phan</div>
          <div>Hotline: 0981883338</div>
        </div>
        <div className="w-20 border-b border-dashed m-auto mt-3 mb-3"></div>
      </div>
      <div className="text-center">
        <div className="uppercase font-bold text-sm">Hóa đơn dịch vụ</div>
        <div className="text-xs">#42681 - 18/04/2023 10:07</div>
      </div>
      <div className="text-xs mt-3">
        <div className="flex justify-between">
          <div>Khách hàng</div>
          <div className="font-medium">Nguyễn Tài Tuấn</div>
        </div>
        <div className="flex justify-between">
          <div>Số điện thoại</div>
          <div className="font-medium">0971021196</div>
        </div>
        <div className="flex justify-between">
          <div>Địa chỉ</div>
          <div className="font-medium">Triệu Sơn, Thanh Hóa</div>
        </div>
      </div>
    </div>
  )
})

export default PrinterOs
