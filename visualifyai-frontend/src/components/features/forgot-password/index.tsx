import { forgotPasswordApi } from '@/apis/auth/forgot-password'
import { BaseModal } from '@/components/common/modal/baseModal'
import { ModalComponentProps } from '@/components/common/modal/modal.type'
import { CheckSuccessIcon } from '@/components/icons/check-sucess-icon'
import { LockIcon } from '@/components/icons/lock-icoin'
import { Button, Form, Input, Typography } from 'antd'
import { useState } from 'react'

const { Title, Paragraph } = Typography

interface ForgotPasswordFormData {
  email: string
}

export const ForgotPasswordModal = ({ modalRef }: ModalComponentProps) => {
  const [form] = Form.useForm()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleSendReset = async (values: ForgotPasswordFormData) => {
    try {
      showLoading()
      await forgotPasswordApi(values.email)

      hideLoading()
      setIsSubmitted(true)
    } catch {
      hideLoading()
    }
  }

  const handleBackToLogin = () => {
    modalRef?.stop()
  }

  return (
    <BaseModal
      width={400}
      title={null}
      hideConfirmBtn
      onCancel={() => modalRef?.stop()}
      styles={{
        body: { padding: '32px 24px' }
      }}
    >
      {isSubmitted ? (
        <div className='text-center'>
          <div className='mb-4'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckSuccessIcon />
            </div>
          </div>

          <Title level={3} className='!mb-2 !text-gray-900'>
            Email đã được gửi!
          </Title>
          <Paragraph className='!text-gray-500 !mb-8'>
            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng
            dẫn.
          </Paragraph>

          <div className='text-center'>
            <Button
              type='link'
              onClick={() => {
                setIsSubmitted(false)
                modalRef?.stop()
              }}
            >
              Quay lại trang chủ
            </Button>
          </div>
        </div>
      ) : (
        <div className='text-center'>
          {/* Lock Icon */}
          <div className='flex justify-center mb-6'>
            <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center'>
              <LockIcon />
            </div>
          </div>

          {/* Title */}
          <Title level={3} className='!mb-2 !text-gray-900'>
            Quên mật khẩu?
          </Title>
          <Paragraph className='!text-gray-500 !mb-8'>
            Nhập email của bạn dưới đây và chúng tôi sẽ gửi cho bạn một mật khẩu mới.
          </Paragraph>

          {/* Reset Form */}
          <Form form={form} layout='vertical' onFinish={handleSendReset} className='text-left'>
            <Form.Item
              className='!mb-8'
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
              ]}
            >
              <Input size='large' placeholder='you@email.com' className='!h-12' />
            </Form.Item>

            <Form.Item className='!mb-6'>
              <Button type='primary' size='large' htmlType='submit' className='btn-base-secondary'>
                Gửi lại mật khẩu
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Links */}
          <div className='flex justify-between items-center'>
            <Button type='link' onClick={handleBackToLogin}>
              Quay lại đăng nhập
            </Button>
            <Button type='link' onClick={handleBackToLogin}>
              Cần trợ giúp?
            </Button>
          </div>
        </div>
      )}
    </BaseModal>
  )
}
