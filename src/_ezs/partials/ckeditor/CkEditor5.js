import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import UploadsAPI from 'src/_ezs/api/uploads.api'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'

export default function CkEditor5({ value = '', onChange }) {
  const editorRef = useRef(null)
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative">
      {loading && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-sm text-gray-500 rounded-lg bg-gray-50"
          style={{ zIndex: 10 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 rounded-full border-primary border-t-transparent animate-spin"></div>
            Đang tải trình soạn thảo...
          </div>
        </div>
      )}
      <Editor
        tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
        onInit={(_, editor) => {
          editorRef.current = editor
          setLoading(false)
        }}
        initialValue={value}
        init={{
          menubar: false,
          branding: false,
          license_key: 'gpl',
          base_url: `${process.env.PUBLIC_URL}/tinymce`,
          suffix: '.min',
          height: 300,
          max_height: 500,
          autoresize_min_height: 500,
          autoresize_max_height: 500,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
            'emoticons',
            'autoresize',
            'quickbars'
          ],
          toolbar:
            'bold italic underline strikethrough forecolor backcolor | ' +
            'link image media table ' + 
            'undo redo | blocks fontfamily fontsize | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | charmap emoticons | code fullscreen preview help',
          toolbar_mode: 'sliding',
          image_caption: true,
          relative_urls: false,
          remove_script_host: false,
          convert_urls: false,

          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:1.6 }',

          // ✅ Bước 1: Mở file picker
          file_picker_types: 'image',
          file_picker_callback: (cb, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = async function () {
                const file = this.files[0]
                const formData = new FormData()
                formData.append('file', file)

                try {
                  const { data } = await UploadsAPI.sendFile(formData)
                  // 👇 Chỉ gọi callback — KHÔNG chèn HTML thủ công
                  const imageUrl = toAbsolutePath(data.data)
                  cb(imageUrl, { title: file.name })
                } catch (err) {
                  console.error('Upload image failed:', err)
                }
              }
              input.click()
            }
          },

          // ✅ Bước 2: Cho phép TinyMCE tự upload khi dán / kéo thả ảnh
          automatic_uploads: true,

          // ✅ Bước 3: Xử lý upload thực tế
          images_upload_handler: async (blobInfo, progress) => {
            const formData = new FormData()
            formData.append('file', blobInfo.blob(), blobInfo.filename())

            try {
              const { data } = await UploadsAPI.sendFile(formData)
              const imageUrl = toAbsolutePath(data.data)
              return imageUrl // ✅ TinyMCE 8 yêu cầu return Promise<string>
            } catch (err) {
              console.error('Upload failed:', err)
              throw new Error('Upload failed')
            }
          }
        }}
        onEditorChange={content => onChange && onChange(content)}
      />
    </div>
  )
}
