import http from 'src/_ezs/utils/http'

const ConfigAPI = {
  getName: name =>
    http.get(`/api/v3/config?cmd=getnames&names=${name}&ignore_root=1`),
  saveName: body =>
    http.post('/api/v3/ConfigJson@save?name=giocam', JSON.stringify(body))
}

export default ConfigAPI
