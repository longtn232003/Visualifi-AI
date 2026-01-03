import { BaseModal } from '@/components/common/modal/baseModal'
import { ModalComponentProps } from '@/components/common/modal/modal.type'
import { FacebookIcon } from '@/components/icons/facebook-icon'
import { GoogleIcon } from '@/components/icons/google-icon'
import { launchModal } from '@/utils/modal'
import { Button, Form, Input, Typography } from 'antd'
import { LoginModal } from '../login'
import { registerApi } from '@/apis/auth/register'

const { Title, Paragraph } = Typography

interface RegisterFormData {
  fullName: string
  email: string
  password: string
}

export const RegisterModal = ({ modalRef }: ModalComponentProps) => {
  const [form] = Form.useForm()

  const handleRegister = async (values: RegisterFormData) => {
    try {
      showLoading()

      await registerApi(values)
      showToast({
        message: 'Đăng ký thành công'
      })
      handleLogin()
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log('Google login')
  }

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook login
    console.log('Facebook login')
  }

  const handleLogin = () => {
    launchModal({
      component: <LoginModal />,
      reset: true
    })
  }

  return (
    <BaseModal width={540} title={null} hideConfirmBtn onCancel={() => modalRef?.stop()}>
      <div className='text-center'>
        <Title level={3} className='!mb-2 !text-gray-900'>
          Tạo tài khoản
        </Title>
        <Paragraph className='!text-gray-500 !mb-8'>Tạo infographics với AI</Paragraph>

        {/* Social Login Buttons */}
        <div className='space-y-3 mb-6'>
          <Button size='large' className='btn-text-base' onClick={handleGoogleLogin}>
            <GoogleIcon />
            Tiếp tục với Google
          </Button>

          <Button size='large' className='btn-text-base' onClick={handleFacebookLogin}>
            <FacebookIcon />
            Tiếp tục với Facebook
          </Button>
        </div>

        {/* Divider */}
        <div className='flex items-center mb-6'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-4 text-gray-500 text-sm'>Hoặc</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>

        {/* Register Form */}
        <Form form={form} layout='vertical' onFinish={handleRegister} className='text-left'>
          <Form.Item
            label='Tên đầy đủ'
            name='fullName'
            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
          >
            <Input size='large' placeholder='Nhập tên của bạn' className='!h-12' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input size='large' placeholder='Nhập email của bạn' className='!h-12' />
          </Form.Item>

          <Form.Item label='Mật khẩu' name='password' rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password size='large' placeholder='Nhập mật khẩu' className='!h-12' />
          </Form.Item>

          <Form.Item className='!mb-6'>
            <Button type='primary' size='large' htmlType='submit' className='btn-base-secondary'>
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>

        <div className='text-center'>
          <span className='text-gray-600'>Đã có tài khoản? </span>
          <Button className='!px-1' type='link' onClick={handleLogin}>
            Đăng nhập
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
