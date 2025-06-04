import { ElMessage, ElNotification } from 'element-plus'

const notifySuccess = (message: string, title = 'Thành công') => {
  ElNotification({
    // title: title,
    message: message,
    type: 'success',
    offset: 50,
  })
}

const notifyWarning = (message: string, title = 'Cảnh báo') => {
  ElNotification({
    // title: title,
    message: message,
    type: 'warning',
    offset: 50,
  })
}

const notifyInfo = (message: string, title = 'Thông báo') => {
  ElNotification({
    // title: title,
    message: message,
    type: 'info',
    offset: 50,
  })
}

const notifyError = (message: string, title = 'Có lỗi xảy ra') => {
  ElNotification({
    // title: title,
    message: message,
    type: 'error',
    offset: 50,
  })
}

const message = (message: string) => {
  ElMessage({
    message: message,
    offset: 90,
  })
}

const messageSuccess = (message: string) => {
  ElMessage({
    message: message,
    type: 'success',
    offset: 90,
  })
}

const messageError = (message: string, title = 'Error') => {
  ElMessage({
    message: message,
    type: 'error',
    offset: 90,
  })
}

export {
  notifySuccess,
  notifyWarning,
  notifyInfo,
  notifyError,
  message,
  messageSuccess,
  messageError,
}
