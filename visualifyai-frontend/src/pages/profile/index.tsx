import { AvatarBase } from '@/components/base/avatar'
import { useAuthStore } from '@/stores/auth'
import { getUrlUpload } from '@/utils/common'
import { Card, Col, Divider, Menu, Row, Typography } from 'antd'
import { LogOut, Store, User } from 'lucide-react'
import { useState } from 'react'
import { AccountProfile } from './components/menu-content/account-profile'
import { MyStorage } from './components/menu-content/my-storage'
import { PlanType } from '@/types/user'

const { Title, Text } = Typography

export enum ProfileMenu {
  PROFILE = 'profile',
  MY_STORAGE = 'my-storage'
}

const ProfilePage = () => {
  const { user, logout } = useAuthStore()
  const [selectedMenuItem, setSelectedMenuItem] = useState(ProfileMenu.PROFILE)

  const menuItems = [
    {
      key: ProfileMenu.PROFILE,
      icon: <User size={20} />,
      label: 'Thông tin tài khoản'
    },
    {
      key: ProfileMenu.MY_STORAGE,
      icon: <Store size={20} />,
      label: 'Kho lưu trữ'
    }
  ]

  const renderProfileContent = () => {
    switch (selectedMenuItem) {
      case 'profile':
        return <AccountProfile />
      case 'my-storage':
        return <MyStorage />
      default:
        return <></>
    }
  }

  const renderTitle = () => {
    switch (selectedMenuItem) {
      case ProfileMenu.PROFILE:
        return {
          title: 'Thông tin tài khoản',
          description: 'Quản lý thông tin cá nhân và cài đặt tài khoản của bạn'
        }
      case ProfileMenu.MY_STORAGE:
        return {
          title: 'Kho lưu trữ',
          description: 'Quản lý kho lưu trữ của bạn'
        }
      default:
        return {
          title: '',
          description: ''
        }
    }
  }

  const renderPlanType = () => {
    if (!user) return

    switch (user.planType) {
      case PlanType.FREE:
        return 'Free Member'
      case PlanType.PRO:
        return 'Pro Member'
      case PlanType.BUSINESS:
        return 'Business Member'
      default:
        return ''
    }
  }

  return (
    <div className='bg-[#f8f9ff] min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-14'>
        <Row gutter={32}>
          {/* Sidebar */}
          <Col span={6}>
            <div className='space-y-6 '>
              <Card className='border-none shadow-md'>
                <div className='text-center mb-6'>
                  <div className='mb-4'>
                    <AvatarBase
                      firstLetter={user?.fullName?.charAt(0) ?? 'S'}
                      path={getUrlUpload(user?.avatarUrl)}
                      className='!w-16 !h-16 mx-auto'
                    />
                  </div>
                  <Title level={4} className='!mb-1'>
                    {user?.fullName || 'Sarah Wilson'}
                  </Title>
                  <Text className='text-blue-600 text-sm'>{renderPlanType()}</Text>
                </div>

                <Menu
                  mode='vertical'
                  selectedKeys={[selectedMenuItem]}
                  className='border-none'
                  onClick={({ key }) => setSelectedMenuItem(key as ProfileMenu)}
                  items={menuItems}
                />

                <Divider />

                <div
                  className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-red-600'
                  onClick={logout}
                >
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </div>
              </Card>
            </div>
          </Col>

          {/* Main Content */}
          <Col span={18}>
            <div className='space-y-6'>
              {/* Header */}
              <div className='mb-8'>
                <Title level={2} className='!mb-2'>
                  {renderTitle().title}
                </Title>
                <Text className='text-gray-600'>{renderTitle().description}</Text>
              </div>

              {/* Content */}
              {renderProfileContent()}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ProfilePage
