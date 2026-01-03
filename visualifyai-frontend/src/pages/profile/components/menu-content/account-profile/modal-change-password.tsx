import { changePasswordApi } from '@/apis/user/change-password'
import { BaseModal } from '@/components/common/modal/baseModal'
import { ModalComponentProps } from '@/components/common/modal/modal.type'
import { Form, Input } from 'antd'

interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const ModalChangePassword = ({ modalRef }: ModalComponentProps) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values: ChangePasswordFormData) => {
    try {
      showLoading()
      await changePasswordApi(values)

      showToast({
        message: 'Đổi mật khẩu thành công!'
      })

      modalRef?.stop()
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  return (
    <BaseModal title='Đổi mật khẩu' onCancel={() => modalRef?.stop()} onOk={() => form.submit()} width={500}>
      <div className='py-4'>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            label='Mật khẩu hiện tại'
            name='currentPassword'
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password placeholder='Nhập mật khẩu hiện tại' size='large' />
          </Form.Item>

          <Form.Item
            label='Mật khẩu mới'
            name='newPassword'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder='Nhập mật khẩu mới' size='large' />
          </Form.Item>

          <Form.Item
            label='Xác nhận mật khẩu mới'
            name='confirmPassword'
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                }
              })
            ]}
          >
            <Input.Password placeholder='Nhập lại mật khẩu mới' size='large' />
          </Form.Item>
        </Form>

        <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
          <div className='text-sm text-blue-800'>
            <div className='font-medium mb-2'>Yêu cầu mật khẩu:</div>
            <ul className='space-y-1 text-blue-700'>
              <li>• Ít nhất 6 ký tự</li>
            </ul>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
