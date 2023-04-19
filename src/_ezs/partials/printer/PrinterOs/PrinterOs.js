import React, { forwardRef } from 'react'
import Barcode from 'react-barcode'

const PrinterOs = forwardRef((props, ref) => {
  return (
    <div className="font-inter text-[#000]" ref={ref}>
      <div className="text-center">
        <div className="uppercase font-bold text-xl">Cser Hà Nội</div>
        <div className="text-[10px] leading-4 font-semibold">
          <div>22/42 Vũ Ngọc Phan</div>
          <div>Hotline: 0981883338</div>
        </div>
        <div className="w-20 border-b border-dashed m-auto mt-3 mb-3"></div>
      </div>
      <div className="text-center">
        <div className="uppercase font-bold text-sm">Hóa đơn dịch vụ</div>
        <div className="text-[10px]">#42681 - 18/04/2023 10:07</div>
      </div>
      <div className="text-[11px] mt-3">
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
      <div className="text-[#000] mt-4">
        <table className="w-full">
          <thead className="border-y font-bold text-[11px]">
            <tr>
              <th className="px-2 py-1.5 border-r first:border-l text-left">
                Tên mặt hàng
              </th>
              <th className="px-2 py-1.5 border-r first:border-l text-center">
                SL
              </th>
              <th className="px-2 py-1.5 border-r first:border-l text-left">
                Đơn giá
              </th>
              <th className="px-2 py-1.5 border-r first:border-l w-[75px]">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b text-[11px]">
              <td className="px-2 py-1.5 border-r first:border-l leading-4">
                Liệu trình triệt lông bảo hành vĩnh viễn
              </td>
              <td className="px-2 py-1.5 border-r first:border-l text-center">
                1
              </td>
              <td className="px-2 py-1.5 border-r first:border-l">2.800.000</td>
              <td className="px-2 py-1.5 border-r first:border-l font-bold text-right">
                2.800.000
              </td>
            </tr>
            <tr className="border-b text-[11px]">
              <td className="px-2 py-1.5 border-r first:border-l leading-4">
                Phụ phí di chuyển
              </td>
              <td className="px-2 py-1.5 border-r first:border-l text-center">
                2
              </td>
              <td className="px-2 py-1.5 border-r first:border-l">100.000</td>
              <td className="px-2 py-1.5 border-r first:border-l font-bold text-right">
                200.000
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-[11px] leading-5">
          <div>Tổng giá trị :</div>
          <div className="font-bold">5.200.000</div>
        </div>
        <div className="flex justify-between text-[11px] leading-5">
          <div>Giá trị chiết khấu :</div>
          <div className="font-bold">200.000</div>
        </div>
        <div className="flex justify-between text-[11px] leading-5">
          <div className="font-bold">Giá trị cần thanh toán :</div>
          <div className="font-bold">200.000</div>
        </div>
        <div className="flex justify-between text-[11px] leading-5">
          <div className="font-bold">Còn nợ :</div>
          <div className="font-bold">200.000</div>
        </div>
      </div>
      <div className="flex justify-center flex-col items-center text-center mt-5">
        <div>
          <Barcode value="#42681" displayValue={false} height={25} width={1} />
        </div>
        <div className="text-[10px]">Cảm ơn quý khách !</div>
        <div className="text-[10px]">Thời gian in : 18/04/2023 16:34</div>
      </div>
    </div>
  )
})

export default PrinterOs
