import { Button, Modal } from 'antd'
import { BaseModalProps } from './modal.type'
import { X } from 'lucide-react'

export const BaseModal = (props: BaseModalProps) => {
  const {
    onCancel,
    onOk,
    children,
    footer,
    width = 800,
    title = 'Modal title',
    styles,
    open = true,
    hideCancelBtn = false,
    hideConfirmBtn = false
  } = props

  const renderTitle = () => {
    if (typeof title === 'string') return <h5 className='text-xl font-bold'>{title}</h5>

    return title
  }

  return (
    <Modal
      {...props}
      open={open}
      maskClosable={false}
      closeIcon={<X size={24} className='text-gray-700' />}
      width={width}
      title={renderTitle()}
      styles={styles}
      footer={
        footer
          ? footer
          : [
              !hideCancelBtn && (
                <Button size='middle' key='cancel' type='default' onClick={onCancel}>
                  Đóng
                </Button>
              ),
              !hideConfirmBtn && (
                <Button size='middle' key='submit' type='primary' onClick={onOk}>
                  Xác nhận
                </Button>
              )
            ]
      }
    >
      {children}
    </Modal>
  )
}
