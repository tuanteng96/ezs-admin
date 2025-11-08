import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import UploadsAPI from 'src/_ezs/api/uploads.api'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'

function CkEditor5({ value = '', onChange, placeholder }) {
  const editorRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [initValue] = useState(
    value.replace(
      /(src|data-mce-src)\s*=\s*["'](?:\.\.\/)+([^"']+)["']/gis,
      (match, attr, path) => `${attr}="/${path}"`
    ) // ✅ chỉ set 1 lần duy nhất
  )

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
        initialValue={initValue} // ✅ chỉ khởi tạo 1 lần
        init={{
          height: 300,
          max_height: 500,
          menubar: false,
          branding: false,
          license_key: 'gpl',
          base_url: `${process.env.PUBLIC_URL}/tinymce`,
          suffix: '.min',
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
          content_style:
            'body { font-family:Be Vietnam Pro,sans-serif; font-size:15px; line-height:1.6 }',
          placeholder,
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
                  cb(toAbsolutePath(data.data), { title: file.name })
                } catch (err) {
                  console.error('Upload image failed:', err)
                }
              }
              input.click()
            }
          },
          automatic_uploads: true,
          images_upload_handler: async blobInfo => {
            const formData = new FormData()
            formData.append('file', blobInfo.blob(), blobInfo.filename())
            try {
              const { data } = await UploadsAPI.sendFile(formData)

              return toAbsolutePath(data.data)
            } catch (err) {
              throw new Error('Upload failed')
            }
          },
          quickbars_insert_toolbar: false,
          quickbars_selection_toolbar: false,
          quickbars_image_toolbar: false
        }}
        onEditorChange={content => {
          let newContent = content
          if (newContent) {
            newContent = newContent.replace(
              /(src|data-mce-src)\s*=\s*["'](?:\.\.\/)+([^"']+)["']/gis,
              (match, attr, path) => `${attr}="/${path}"`
            )
          }
          onChange && onChange(newContent)
        }} // ✅ chỉ gửi dữ liệu ra
      />
    </div>
  )
}

// ✅ Ngăn React re-render lại editor khi value không đổi
export default React.memo(CkEditor5, (prev, next) => prev.value === next.value)
