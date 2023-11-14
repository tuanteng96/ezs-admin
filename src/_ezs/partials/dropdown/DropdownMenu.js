import { useRef, useState } from 'react'
import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions
} from '@floating-ui/react'
import { cloneElement } from 'react'

const DropdownMenu = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)
  const { x, y, refs, context } = useFloating({
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

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss
  ])

  return (
    <>
      {cloneElement(trigger, {
        ref: refs.setReference,
        ...getReferenceProps()
      })}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal>
            <div
              aria-hidden
              className="fixed rounded px-0 py-2 border-0 min-w-[180px] bg-white shadow-lg shadow-blue-gray-500/10 dark:bg-site-aside dark:shadow-dark-shadow"
              style={{
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 1009
              }}
              ref={refs.setFloating}
              {...getFloatingProps()}
            >
              {children}
              <FloatingArrow
                className="fill-white"
                ref={arrowRef}
                context={context}
              />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  )
}

export default DropdownMenu
