import React from 'react'
import { NavLink } from 'react-router-dom'

function CatalogueLayout({ children }) {
  return (
    <div className="flex h-full border-t bg-white border-separator">
      <div className="w-52 border-r border-separator px-3 py-4">
        <div className="font-bold font-inter text-[17px] py-2 px-4">
          Danh mục
        </div>
        <ul>
          <li>
            <NavLink
              className="block px-4 py-2.5 text-[15px] bg-primarylight rounded-md font-medium hover:bg-primarylight transition mt-1"
              to="/"
            >
              Sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink
              className="block px-4 py-2.5 text-[15px] font-semibold hover:bg-primarylight transition rounded-md mt-1"
              to="/"
            >
              Dịch vụ
            </NavLink>
          </li>
          <li>
            <NavLink
              className="block px-4 py-2.5 text-[15px] font-semibold hover:bg-primarylight transition rounded-md mt-1"
              to="/"
            >
              Thẻ tiền
            </NavLink>
          </li>
          <li>
            <NavLink
              className="block px-4 py-2.5 text-[15px] font-semibold hover:bg-primarylight transition rounded-md mt-1"
              to="/"
            >
              Phụ phí
            </NavLink>
          </li>
          <li>
            <NavLink
              className="block px-4 py-2.5 text-[15px] font-semibold hover:bg-primarylight transition rounded-md mt-1"
              to="/"
            >
              Nguyên vật liệu
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export { CatalogueLayout }
