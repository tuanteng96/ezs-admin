import http from 'src/_ezs/utils/http'

const UploadsAPI = {
  sendFile: (body, progressCallBack) =>
    http.post('/api/v3/file?cmd=upload', body, {
      onUploadProgress: ev =>
        progressCallBack &&
        progressCallBack(Math.round((ev.loaded * 100) / ev.total))
    }),
  sendMultiFiles: (data) => {
    return http.post("/api/v3/file25@uploads", data)
  }
}

export default UploadsAPI