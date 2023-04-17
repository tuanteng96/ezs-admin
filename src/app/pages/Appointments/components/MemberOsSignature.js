import React from 'react'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'
import Viewer from 'react-viewer'
import { useState } from 'react'

const MemberOsSignature = ({ ServiceOs }) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="flex justify-between px-6 py-4 border-b border-separator dark:border-dark-separator">
      <div className="text-gray-500">Chữ ký khách hàng</div>
      <div className="flex justify-end">
        <div
          className="p-5 border rounded border-separator dark:border-dark-separator"
          onClick={() => setVisible(true)}
        >
          <img
            className="w-16 cursor-pointer"
            src={toAbsolutePath(ServiceOs?.StaffHis)}
            alt="Chữ ký khách hàng"
          />
        </div>
      </div>
      <Viewer
        className="bg-white"
        visible={visible}
        activeIndex={0}
        onClose={() => {
          setVisible(false)
        }}
        images={[{ src: toAbsolutePath(ServiceOs?.StaffHis) }]}
        zIndex={1013}
        noFooter={true}
      />
    </div>
  )
}

export { MemberOsSignature }
