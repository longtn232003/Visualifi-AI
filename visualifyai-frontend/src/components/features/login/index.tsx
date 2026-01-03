import logo from '@/assets/images/logo.png'
import { BaseModal } from '@/components/common/modal/baseModal'
import { ModalComponentProps } from '@/components/common/modal/modal.type'
import { FacebookIcon } from '@/components/icons/facebook-icon'
import { GoogleIcon } from '@/components/icons/google-icon'
import { launchModal } from '@/utils/modal'
import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { ForgotPasswordModal } from '../forgot-password'
import { RegisterModal } from '../register'
import { loginApi } from '@/apis/auth/login'
import { useAuthStore } from '@/stores/auth'
import { API_URL } from '@/constants/common'

const { Title, Paragraph } = Typography

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

export const LoginModal = ({ modalRef }: ModalComponentProps) => {
  const [form] = Form.useForm()

  const { setAccessToken, getUserProfile } = useAuthStore()

  const handleLogin = async (values: LoginFormData) => {
    try {
      showLoading()
      const res = await loginApi({
        email: values.email,
        password: values.password
      })
      getUserProfile()

      setAccessToken(res.data.accessToken)

      modalRef?.stop()
      showToast({
        message: 'Đăng nhập thành công'
      })
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const handleGoogleLogin = async () => {
    window.location.href = `${API_URL}/api/v1/auth/google`
  }

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/api/v1/auth/facebook`
  }

  const handleForgotPassword = () => {
    launchModal({
      component: <ForgotPasswordModal />
    })
  }

  const handleRegister = () => {
    launchModal({
      component: <RegisterModal />,
      reset: true
    })
  }

  return (
    <BaseModal width={540} title={null} hideConfirmBtn onCancel={() => modalRef?.stop()}>
      <div className='text-center'>
        {/* Logo */}
        <div className='flex justify-center mb-6'>
          <img src={logo} alt='logo' className='w-12 h-12' />
        </div>

        <Title level={3} className='!mb-2 !text-gray-900'>
          Chào mừng trở lại
        </Title>
        <Paragraph className='!text-gray-500 !mb-8'>Đăng nhập</Paragraph>

        {/* Social Login Buttons */}
        <div className='space-y-3 mb-6'>
          <Button size='large' className='btn-text-base  ' onClick={handleGoogleLogin}>
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

        {/* Login Form */}
        <Form form={form} layout='vertical' onFinish={handleLogin} className='text-left'>
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

          <div className='flex items-center justify-between mb-6'>
            <Form.Item name='remember' valuePropName='checked' className='!mb-0'>
              <Checkbox className='text-gray-600'>Nhớ mật khẩu</Checkbox>
            </Form.Item>
            <Button type='link' onClick={handleForgotPassword}>
              Quên mật khẩu?
            </Button>
          </div>

          <Form.Item className='!mb-6'>
            <Button type='primary' size='large' htmlType='submit' className='btn-base-secondary'>
              Tiếp tục
            </Button>
          </Form.Item>
        </Form>

        {/* Sign up link */}
        <div className='text-center'>
          <span className='text-gray-600'>Chưa có tài khoản? </span>
          <Button className='!px-1' type='link' onClick={handleRegister}>
            Đăng kí ngay
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
