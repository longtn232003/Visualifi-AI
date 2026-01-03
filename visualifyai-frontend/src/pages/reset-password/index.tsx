import { Button, Form, Input, Typography, Card } from 'antd'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PATH_ROUTES } from '@/constants/path-route'
import { useState } from 'react'
import { CheckSuccessIcon } from '@/components/icons/check-sucess-icon'
import { resetPasswordApi } from '@/apis/auth/reset-password'

const { Title, Paragraph } = Typography

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

const ResetPasswordPage = () => {
  const { token } = useParams()

  const [form] = Form.useForm()
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!token) return <Navigate to={PATH_ROUTES.home} />

  const handleResetPassword = async (values: ResetPasswordFormData) => {
    try {
      showLoading()
      await resetPasswordApi({ newPassword: values.password, token })
      setIsSubmitted(true)
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  return (
    <div className='bg-[#f8f9ff] min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-lg border-0'>
        <div className='text-center px-6 py-4'>
          {!isSubmitted ? (
            <>
              <Title level={3} className='!mb-2 !text-gray-900'>
                Đặt lại mật khẩu
              </Title>
              <Paragraph className='!text-gray-500 !mb-8'>Nhập mật khẩu mới của bạn</Paragraph>

              {/* Reset Password Form */}
              <Form form={form} layout='vertical' onFinish={handleResetPassword} className='text-left'>
                <Form.Item
                  label='Mật khẩu mới'
                  name='password'
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password size='large' placeholder='Nhập mật khẩu mới' className='!h-12' />
                </Form.Item>

                <Form.Item
                  label='Xác nhận mật khẩu'
                  name='confirmPassword'
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                      }
                    })
                  ]}
                >
                  <Input.Password size='large' placeholder='Nhập lại mật khẩu mới' className='!h-12' />
                </Form.Item>

                <Form.Item className='!mb-6'>
                  <Button type='primary' size='large' htmlType='submit' className='btn-base-secondary w-full'>
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>
              </Form>

              <div className='text-center'>
                <Link to={PATH_ROUTES.home} className='text-blue-600 hover:text-blue-700'>
                  Quay lại trang chủ
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className='mb-4'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <CheckSuccessIcon />
                </div>
              </div>

              <Title level={3} className='!mb-2 !text-gray-900'>
                Mật khẩu đã được đặt lại
              </Title>
              <Paragraph className='!text-gray-500 !mb-8'>
                Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể đăng nhập với mật khẩu mới.
              </Paragraph>

              <div className='text-center'>
                <Link to={PATH_ROUTES.home}>Đăng nhập ngay</Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ResetPasswordPage
