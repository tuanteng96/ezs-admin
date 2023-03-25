import React from 'react'

function FixedLayout({ children }) {
  return (
    <div className="fixed w-full h-full top-0 left-0 bg-white z-[1010]">
      {children}
    </div>
  )
}

export default FixedLayout
