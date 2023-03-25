import http from 'src/_ezs/utils/http'

const TasksAPI = {
  getTasksAll: ({ StockID, From, To }) =>
    http.get(
      `/api/v3/usertask?cmd=list&stockid=${StockID}&loadId=2&from=${From}&to=${To}`
    ),
  doTasksNoti: body => http.post(`/api/v3/usertask?cmd=doNoti`, body),
  cancelBook: body =>
    http.post(
      `/api/v3/mbookadmin?cmd=CancelDateAdminView`,
      JSON.stringify(body)
    ),
  confirmContact: body => http.post(`/api/v3/usertask?cmd=doRead`, body),
  doSmsPayed: body => http.post(`/api/v3/usertask?cmd=doSmsPayed`, body)
}

export default TasksAPI
