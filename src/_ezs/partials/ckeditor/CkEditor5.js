import React, { useState } from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { FloatingPortal } from '@floating-ui/react'
import { m } from 'framer-motion'
import useEscape from 'src/_ezs/hooks/useEscape'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline'

import UploadAdapter from './UploadAdapter'
import clsx from 'clsx'

function CkEditor5({
  value,
  onChange,
  placeholder,
  className,
  toolbar = [
    // 'undo',
    // 'redo',
    // '|',
    'heading',
    '|',
    'alignment',
    'fontfamily',
    'fontsize',
    'fontColor',
    'fontBackgroundColor',
    '|',
    'bold',
    'italic',
    'strikethrough',
    'subscript',
    'superscript',
    'code',
    '|',
    'mediaEmbed',
    'link',
    'uploadImage',
    'blockQuote',
    'codeBlock',
    'insertTable',
    '|',
    'bulletedList',
    'numberedList',
    'todoList',
    'outdent',
    'indent'
  ]
}) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  useEscape(() => onHide())

  return (
    <>
      <div className={clsx(className, 'relative')}>
        <div
          className="absolute bottom-0 right-0 z-10 flex items-center justify-center w-10 h-10 text-gray-600 transition-colors cursor-pointer hover:text-black"
          onClick={() => setVisible(true)}
        >
          <ArrowsPointingOutIcon className="w-5" />
        </div>
        <CKEditor
          editor={Editor}
          config={{
            placeholder: placeholder
          }}
          onReady={editor => {
            if (editor && editor.plugins) {
              editor.plugins.get('FileRepository').createUploadAdapter =
                function (loader) {
                  return new UploadAdapter(loader)
                }
            }
          }}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData()
            onChange(data)
          }}
        />
        {/* <CKEditor
        editor={ClassicEditor}
        config={{
          placeholder: placeholder,
          fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21]
          },
          toolbar: toolbar,
          plugins: [Paragraph, Bold, Italic, Essentials]
        }}
        onReady={editor => {
          if (editor && editor.plugins) {
            editor.plugins.get('FileRepository').createUploadAdapter =
              function (loader) {
                return new UploadAdapter(loader)
              }
          }
        }}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange(data)
        }}
      /> */}
      </div>
      {visible && (
        <FloatingPortal root={document.body}>
          <m.div
            className="fixed inset-0 bg-black/[.2] dark:bg-black/[.4] z-[1050]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onHide}
          ></m.div>
          <m.div
            className="fixed h-full w-full top-0 left-0 z-[1050] ck-wrap-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CKEditor
              editor={Editor}
              config={{
                placeholder: placeholder
              }}
              onReady={editor => {
                if (editor && editor.plugins) {
                  editor.plugins.get('FileRepository').createUploadAdapter =
                    function (loader) {
                      return new UploadAdapter(loader)
                    }
                }
              }}
              data={value}
              onChange={(event, editor) => {
                const data = editor.getData()
                onChange(data)
              }}
            />
            <div
              className="absolute bottom-0 right-0 z-10 flex items-center justify-center w-10 h-10 transition-colors cursor-pointer lg:top-0"
              onClick={() => setVisible(false)}
            >
              <ArrowsPointingInIcon className="w-6" />
            </div>
          </m.div>
        </FloatingPortal>
      )}
    </>
  )
}

export default CkEditor5
