import React from 'react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'

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
  return (
    <div className={className}>
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
  )
}

export default CkEditor5
