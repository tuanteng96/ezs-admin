import { useState } from 'react'
import Select from 'react-select'

const SelectTypeLink = ({ value, ...props }) => {
  const [data] = useState([
    {
      label: 'Tự nhập Link',
      value: 'CUSTOM'
    },
    {
      label: 'Tới danh mục tin tức',
      value: 'NEWS'
    },
    {
      label: 'Tới bài viết tin tức',
      value: 'NEWS_DETAIL'
    },
    {
      label: 'Tới sản phẩm, dịch vụ khuyến mại',
      value: 'SALE'
    },
    {
      label: 'Tới nhóm sản phẩm, dịch vụ',
      value: 'CATE_ID'
    },
    {
      label: 'Tới chi tiết sản phẩm, dịch vụ',
      value: 'PROD_ID'
    },
    {
      label: 'Tới chi tiết Media, Video',
      value: 'ADV_ID'
    },
    {
      label: 'Tới chi tiết dịch vụ gốc',
      value: 'SERVICE_ID'
    },
    {
      label: 'Tới danh sách Voucher',
      value: 'VOUCHER'
    },
    // {
    //   label: 'Tới dịch vụ gốc',
    //   value: 'CATE_SERVICE_ID'
    // },
    {
      label: 'Tới đặt lịch dịch vụ',
      value: 'BOOK_SERVICE'
    },
    {
      label: 'Tới form đăng ký ưu đãi',
      value: 'FORM_SALES'
    }
  ])

  return (
    <div>
      <Select
        isClearable
        className="select-control"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: base => ({
            ...base,
            zIndex: 9999
          })
        }}
        value={value ? data.filter(x => x.value === value) : ''}
        classNamePrefix="select"
        options={data}
        placeholder="Chọn loại Link"
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </div>
  )
}

export default SelectTypeLink
