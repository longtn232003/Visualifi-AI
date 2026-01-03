import { message } from 'antd'

export interface IToast {
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading'
  message: string
}

export let showToast: (data: IToast) => void

export const ToastContainer = () => {
  const [messageApi, contextHolder] = message.useMessage()

  showToast = ({ type = 'success', message }: IToast) => {
    messageApi.open({
      type,
      content: message,
      duration: 5
    })
  }

  return contextHolder
}
