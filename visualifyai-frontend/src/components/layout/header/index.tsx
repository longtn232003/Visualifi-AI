import { Layout, Button, Menu, Dropdown, Typography } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import { launchModal } from '@/utils/modal'
import { LoginModal } from '@/components/features/login'
import { RegisterModal } from '@/components/features/register'
import { PATH_ROUTES } from '@/constants/path-route'
import { ItemType } from 'antd/es/menu/interface'
import { MenuItemType } from 'antd/es/menu/interface'
import { AvatarBase } from '@/components/base/avatar'
import { useAuthStore } from '@/stores/auth'
import { ChevronDown, ChevronUp, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { getUrlUpload } from '@/utils/common'

const menuItems: ItemType<MenuItemType>[] = [
  {
    key: PATH_ROUTES.home,
    label: (
      <Link to={PATH_ROUTES.home} className='text-[16px] font-normal'>
        Trang chủ
      </Link>
    )
  },
  {
    key: PATH_ROUTES.createInfographic,
    label: (
      <Link to={PATH_ROUTES.createInfographic} className='text-[16px] font-normal'>
        Tạo mẫu
      </Link>
    )
  },
  {
    key: PATH_ROUTES.templateStore,
    label: (
      <Link to={PATH_ROUTES.templateStore} className='text-[16px] font-normal'>
        Tham khảo mẫu
      </Link>
    )
  },
  {
    key: PATH_ROUTES.pricing,
    label: (
      <Link to={PATH_ROUTES.pricing} className='text-[16px] font-normal'>
        Giá cả
      </Link>
    )
  }
]

export const Header = () => {
  const pathname = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [openDropdownUser, setOpenDropdownUser] = useState<boolean>(false)

  const handleLoginClick = () => {
    launchModal({
      component: <LoginModal />
    })
  }

  const handleRegisterClick = () => {
    launchModal({
      component: <RegisterModal />
    })
  }
  return (
    <Layout.Header
      className=''
      style={{
        padding: '0 24px',
        height: '64px',
        lineHeight: '64px'
      }}
    >
      <div className='container mx-auto h-full'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate(PATH_ROUTES.home)}>
            <img src={logo} alt='logo' className='w-8 h-8' />
            <h1 className='text-white text-xl font-medium m-0'>VISUALIFY AI</h1>
          </div>

          {/* Menu navigation */}
          <Menu
            selectedKeys={[pathname.pathname]}
            mode='horizontal'
            items={menuItems}
            className='bg-transparent border-none min-w-0 flex-1 justify-center'
            style={{
              backgroundColor: 'transparent',
              borderBottom: 'none'
            }}
            theme='dark'
          />

          {user ? (
            // User dropdown
            <div className='flex items-center gap-2'>
              <Typography.Text className='!text-white font-medium'>{user?.fullName}</Typography.Text>

              <Dropdown
                onOpenChange={open => {
                  setOpenDropdownUser(open)
                }}
                trigger={['click']}
                placement='bottomRight'
                arrow
                menu={{
                  items: [
                    {
                      key: 'profile',
                      label: <span>Tài khoản</span>,
                      icon: <User className='w-4 h-4' />,
                      onClick: () => navigate(PATH_ROUTES.profile)
                    },
                    {
                      type: 'divider'
                    },
                    {
                      key: 'logout',
                      label: <span className='text-red-600'>Đăng xuất</span>,
                      icon: <LogOut className='w-4 h-4 text-red-600' />,
                      onClick: logout
                    }
                  ]
                }}
              >
                <Button type='text' className='!text-white !p-0'>
                  <AvatarBase firstLetter={user?.fullName?.charAt(0) ?? ''} path={getUrlUpload(user?.avatarUrl)} />
                  {openDropdownUser ? <ChevronUp size={20} color='white' /> : <ChevronDown size={20} color='white' />}
                </Button>
              </Dropdown>
            </div>
          ) : (
            // Login and signup buttons
            <div className='flex items-center gap-3 auth-buttons'>
              <Button type='text' className='!text-white' onClick={handleLoginClick}>
                Đăng nhập
              </Button>
              <Button type='primary' className='text-white' onClick={handleRegisterClick}>
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout.Header>
  )
}
