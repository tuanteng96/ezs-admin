import http from 'src/_ezs/utils/http'

const WorksheetAPI = {
  getAllWorkSheet: data => {
    return http.post('/api/v3/userwork23@workList', JSON.stringify(data))
  },
  checkinWorkSheet: data => {
    return http.post('/api/v3/worktrack@adminedit', JSON.stringify(data))
  },
  deleteWorkSheet: data => {
    return http.post(
      '/api/v3/userwork23@sysCheckinDelete',
      JSON.stringify(data)
    )
  }
}
export default WorksheetAPI
