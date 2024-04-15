import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import UploadAdapter from './UploadAdapter'

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
  return (
    <div className={className}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          placeholder: placeholder,
          fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21]
          },
          toolbar: toolbar
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
    </div>
  )
}

export default CkEditor5
