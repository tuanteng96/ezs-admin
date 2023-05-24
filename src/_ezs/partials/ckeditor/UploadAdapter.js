import UploadsAPI from 'src/_ezs/api/uploads.api'
import { toAbsolutePath } from 'src/_ezs/utils/assetPath'

class UploadAdapter {
  constructor(loader) {
    this.loader = loader
    this.upload = this.upload.bind(this)
    this.abort = this.abort.bind(this)
  }

  upload() {
    return new Promise((resolve, reject) => {
      this.loader.file
        .then(result => {
          const data = new FormData()
          data.append(result.name, result)
          return UploadsAPI.sendFile(data)
            .then(res => {
              var resData = res.uploaded[0].Name
              resolve({ default: toAbsolutePath(resData) })
            })
            .catch(error => {
              console.log(error)
              reject(error)
            })
        })
        .catch(err => reject(err))
    })
  }

  abort() {
    // Reject promise returned from upload() method.
  }
}
export default UploadAdapter
