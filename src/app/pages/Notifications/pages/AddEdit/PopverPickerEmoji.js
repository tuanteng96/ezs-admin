import {
  FloatingFocusManager,
  autoUpdate,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  flip
} from '@floating-ui/react'
import React, { cloneElement, useState } from 'react'
import Picker from 'emoji-picker-react'

function PopverPickerEmoji({ value, trigger, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const { x, y, refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ])

  return (
    <>
      {cloneElement(trigger, {
        ref: refs.setReference,
        ...getReferenceProps()
      })}
      {isOpen && (
        <FloatingFocusManager
          context={context}
          order={['reference', 'content']}
        >
          <div
            className="fixed z-[1011]"
            style={{
              ...floatingStyles,
              top: y ?? 0,
              left: x ?? 0
            }}
            ref={refs.setFloating}
            {...getFloatingProps()}
          >
            <Picker
              onEmojiClick={(emojiData, event) => {
                const textAreaElement = document.getElementById('text-area')
                onChange(
                  value.substr(0, textAreaElement.selectionStart) +
                    emojiData.emoji +
                    value.substr(textAreaElement.selectionEnd)
                )
              }}
            />
          </div>
        </FloatingFocusManager>
      )}
    </>
  )
}

export default PopverPickerEmoji
