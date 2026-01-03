import { useAuthStore } from '@/stores/auth'
import { launchModal } from '@/utils/modal'
import { Button, Card, Col, Dropdown, Row, Switch, Typography } from 'antd'
import { ChevronDown, Edit } from 'lucide-react'
import { ModalEditProfile } from './modal-edit-profile'
import { ModalChangePassword } from './modal-change-password'
import { getDiffForHumans } from '@/utils/format-date'

const { Title, Text } = Typography

const languageItems = {
  items: [
    {
      key: 'vi',
      label: 'Tiếng Việt (VN)'
    },
    {
      key: 'en',
      label: 'English (EN)'
    }
  ]
}

export const AccountProfile = () => {
  const { user } = useAuthStore()

  const handleEditProfile = () => {
    launchModal({ component: <ModalEditProfile /> })
  }

  const handleChangePassword = () => {
    launchModal({ component: <ModalChangePassword /> })
  }

  return (
    <div className='!space-y-6'>
      {/* Profile Details Section */}
      <Card className='border-none shadow-md'>
        <div className='flex items-center justify-between mb-6'>
          <Title level={4} className='!mb-0'>
            Chi tiết hồ sơ
          </Title>
          <Button type='link' onClick={handleEditProfile}>
            <Edit size={16} className='mr-1' />
            Chỉnh sửa
          </Button>
        </div>

        <Row gutter={[32, 24]}>
          <Col span={12}>
            <div>
              <Text className='text-gray-500 text-sm'>Tên đầy đủ</Text>
              <div className='mt-1'>
                <Text className='text-gray-900 font-medium'>{user?.fullName}</Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text className='text-gray-500 text-sm'>Email</Text>
              <div className='mt-1'>
                <Text className='text-gray-900 font-medium'>{user?.email}</Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text className='text-gray-500 text-sm'>Số điện thoại</Text>
              <div className='mt-1'>
                <Text className='text-gray-900 font-medium'>{user?.phoneNumber ?? ''}</Text>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text className='text-gray-500 text-sm'>Địa chỉ</Text>
              <div className='mt-1'>
                <Text className='text-gray-900 font-medium'>{user?.address ?? ''}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Security Section */}
      <Card className='border-none shadow-md'>
        <Title level={4} className='!mb-6'>
          Bảo mật
        </Title>

        <div className='space-y-6'>
          {/* Password */}
          <div className='flex items-center justify-between py-4 border-b border-gray-100'>
            <div>
              <Text className='font-medium text-gray-900'>Mật khẩu</Text>
              <div className='mt-1'>
                <Text className='text-sm text-gray-500'>
                  {user?.lastUpdatedPassword
                    ? `Lần thay đổi cuối cùng đã đây khoảng ${getDiffForHumans(user?.lastUpdatedPassword)}`
                    : ''}
                </Text>
              </div>
            </div>
            <Button type='link' onClick={handleChangePassword}>
              Đổi mật khẩu
            </Button>
          </div>

          {/* Activity Logs */}
          <div className='flex items-center justify-between py-4'>
            <div>
              <Text className='font-medium text-gray-900'>Phiên hoạt động</Text>
              <div className='mt-1'>
                <Text className='text-sm text-gray-500'>Quản lý các phiên hoạt động của bạn</Text>
              </div>
            </div>
            <Button type='link'>Xem</Button>
          </div>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card className='border-none shadow-md'>
        <Title level={4} className='!mb-6'>
          Tùy chọn
        </Title>

        <div className='space-y-6'>
          {/* Email Notifications */}
          <div className='flex items-center justify-between py-4 border-b border-gray-100'>
            <div>
              <Text className='font-medium text-gray-900'>Thông báo qua email</Text>
              <div className='mt-1'>
                <Text className='text-sm text-gray-500'>Nhận thông báo cập nhật và bản tin</Text>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Language */}
          <div className='flex items-center justify-between py-4'>
            <div>
              <Text className='font-medium text-gray-900'>Ngôn ngữ</Text>
              <div className='mt-1'>
                <Text className='text-sm text-gray-500'>Chọn ngôn ngữ ưa thích của bạn</Text>
              </div>
            </div>
            <Dropdown menu={languageItems} trigger={['click']}>
              <Button className='!text-gray-900'>
                Tiếng Việt (VN) <ChevronDown size={16} className='ml-1' />
              </Button>
            </Dropdown>
          </div>
        </div>
      </Card>
    </div>
  )
}
