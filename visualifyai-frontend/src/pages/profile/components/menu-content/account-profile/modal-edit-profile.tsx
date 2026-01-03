import { updateProfile } from '@/apis/user/edit'
import { AvatarBase } from '@/components/base/avatar'
import { BaseModal } from '@/components/common/modal/baseModal'
import { ModalComponentProps } from '@/components/common/modal/modal.type'
import { useAuthStore } from '@/stores/auth'
import { getUrlUpload } from '@/utils/common'
import type { UploadProps } from 'antd'
import { Button, Form, Input, Upload, message } from 'antd'
import { Upload as UploadIcon } from 'lucide-react'
import { useState } from 'react'

interface EditProfileFormData {
  fullName: string
  email: string
  phoneNumber: string
  address: string
}

export const ModalEditProfile = ({ modalRef }: ModalComponentProps) => {
  const { user, getUserProfile } = useAuthStore()
  const [form] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState(getUrlUpload(user?.avatarUrl))
  const [avatarUpload, setAvatarUpload] = useState<File | null>(null)

  const handleSubmit = async (values: EditProfileFormData) => {
    try {
      showLoading()
      const payload = {
        ...values,
        phoneNumber: values.phoneNumber ?? '',
        address: values.address ?? '',
        avatarUrl: avatarUpload
      }

      await updateProfile(payload)

      showToast({
        message: 'Cập nhật hồ sơ thành công!'
      })
      getUserProfile()

      modalRef?.stop()
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const uploadProps: UploadProps = {
    name: 'avatar',
    listType: 'picture',
    showUploadList: false,
    beforeUpload: file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('Chỉ có thể upload file JPG/PNG!')
        return false
      }
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isLt3M) {
        message.error('Kích thước ảnh phải nhỏ hơn 3MB!')
        return false
      }

      setAvatarUpload(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = e => {
        setAvatarUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      return false // Prevent auto upload
    }
  }

  return (
    <BaseModal title='Chỉnh sửa hồ sơ' onCancel={() => modalRef?.stop()} onOk={() => form.submit()} width={600}>
      <div className='py-4'>
        {/* Avatar Section */}
        <div className='text-center mb-8'>
          <div className='relative inline-block'>
            <AvatarBase firstLetter={user?.fullName?.charAt(0) ?? 'U'} path={avatarUrl} className='!w-24 !h-24' />
            <Upload {...uploadProps}></Upload>
          </div>
          <div className='mt-3'>
            <Upload {...uploadProps}>
              <Button type='link' className='!text-blue-600 !p-0'>
                <UploadIcon size={16} className='mr-1' />
                Thay đổi ảnh đại diện
              </Button>
            </Upload>
          </div>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{
            fullName: user?.fullName,
            email: user?.email,
            phoneNumber: user?.phoneNumber,
            address: user?.address
          }}
        >
          <Form.Item
            label='Tên đầy đủ'
            name='fullName'
            rules={[
              { required: true, message: 'Vui lòng nhập tên đầy đủ!' },
              { min: 2, message: 'Tên đầy đủ phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder='Nhập tên đầy đủ' size='large' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder='Nhập địa chỉ email' size='large' />
          </Form.Item>

          <Form.Item
            label='Số điện thoại'
            name='phoneNumber'
            rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }]}
          >
            <Input placeholder='Nhập số điện thoại' size='large' />
          </Form.Item>

          <Form.Item label='Địa chỉ' name='address'>
            <Input.TextArea placeholder='Nhập địa chỉ' rows={3} size='large' />
          </Form.Item>
        </Form>
      </div>
    </BaseModal>
  )
}
