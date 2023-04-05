import React, { Fragment, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Popover } from '@headlessui/react'
import { arrow, FloatingArrow, offset, useFloating } from '@floating-ui/react'

const ButtonDropdown = ({ Button, children, placement, classPopover }) => {
  const arrowRef = useRef(null)
  const { x, y, refs, context } = useFloating({
    placement: placement,
    middleware: [
      offset(8),
      arrow({
        element: arrowRef
      })
    ]
  })
  return (
    <Popover>
      <Popover.Button as={Fragment} ref={refs.setReference}>
        {Button}
      </Popover.Button>
      {createPortal(
        <Popover.Panel
          className={classPopover}
          ref={refs.setFloating}
          style={{
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 1009
          }}
        >
          {children}
          <FloatingArrow
            className="fill-white dark:fill-[#1e1e2d]"
            ref={arrowRef}
            context={context}
          />
        </Popover.Panel>,
        document.body
      )}
    </Popover>
  )
}

ButtonDropdown.propTypes = {}

export { ButtonDropdown }
