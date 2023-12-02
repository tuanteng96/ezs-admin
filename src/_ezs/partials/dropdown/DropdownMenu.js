import { useRef, useState, useId, cloneElement } from 'react'
import {
  FloatingArrow,
  FloatingFocusManager,
  arrow,
  autoUpdate,
  flip,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole
} from '@floating-ui/react'
import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

const DropdownMenu = ({
  children,
  trigger,
  zIndex = 1009,
  className = 'fixed rounded px-0 py-2 border-0 min-w-[180px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)
  const { pathname } = useLocation()
  const { x, y, refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    //placement: 'auto',
    middleware: [
      offset(8),
      flip(),
      arrow({
        element: arrowRef
      })
    ],
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const headingId = useId()

  return (
    <>
      {cloneElement(trigger, {
        ref: refs.setReference,
        ...getReferenceProps()
      })}
      {isOpen &&
        createPortal(
          <FloatingFocusManager
            context={context}
            order={['reference', 'content']}
          >
            <div
              className={className}
              style={{
                ...floatingStyles,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: zIndex
              }}
              ref={refs.setFloating}
              aria-labelledby={headingId}
              {...getFloatingProps()}
            >
              {children}
              <FloatingArrow
                className="fill-white"
                ref={arrowRef}
                context={context}
              />
            </div>
          </FloatingFocusManager>,
          document.body
        )}
    </>
  )
}

export default DropdownMenu
