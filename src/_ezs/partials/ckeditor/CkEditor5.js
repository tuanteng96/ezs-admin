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
    'undo',
    'redo',
    '|',
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
          // heading: {
          //   options: [
          //     {
          //       model: 'paragraph',
          //       title: 'Paragraph',
          //       class: 'ck-heading_paragraph'
          //     },
          //     {
          //       model: 'heading1',
          //       view: 'h1',
          //       title: 'Heading 1',
          //       class: 'ck-heading_heading1'
          //     },
          //     {
          //       model: 'heading2',
          //       view: 'h2',
          //       title: 'Heading 2',
          //       class: 'ck-heading_heading2'
          //     },
          //     {
          //       model: 'heading3',
          //       view: 'h3',
          //       title: 'Heading 3',
          //       class: 'ck-heading_heading3'
          //     },
          //     {
          //       model: 'heading4',
          //       view: 'h4',
          //       title: 'Heading 4',
          //       class: 'ck-heading_heading4'
          //     },
          //     {
          //       model: 'heading5',
          //       view: 'h5',
          //       title: 'Heading 5',
          //       class: 'ck-heading_heading5'
          //     },
          //     {
          //       model: 'heading6',
          //       view: 'h6',
          //       title: 'Heading 6',
          //       class: 'ck-heading_heading6'
          //     }
          //   ]
          // },
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
