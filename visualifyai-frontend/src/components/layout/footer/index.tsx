import { Layout } from 'antd'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export const Footer = () => {
  return (
    <Layout.Footer className='!py-8 border-t border-gray-300'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <h3 className='text-xl font-bold text-white'>VISUALIFY AI</h3>
            <p className='text-gray-300 text-sm leading-relaxed'>
              Công cụ tạo infographic thông minh với sự hỗ trợ của AI
            </p>
          </div>

          <div className='space-y-4'>
            <h4 className='text-lg font-semibold text-white'>Liên kết</h4>
            <ul className='space-y-2'>
              <li>
                <a href='/' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  Trang chủ
                </a>
              </li>
              <li>
                <a href='/templates' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  Mẫu
                </a>
              </li>
              <li>
                <a href='/pricing' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  Giá
                </a>
              </li>
              <li>
                <a href='/blog' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className='space-y-4'>
            <h4 className='text-lg font-semibold !text-white'>Hỗ trợ</h4>
            <ul className='space-y-2'>
              <li>
                <a href='/support' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  Trung tâm hỗ trợ
                </a>
              </li>
              <li>
                <a href='/guide' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  Hướng dẫn
                </a>
              </li>
              <li>
                <a href='/faq' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  FAQ
                </a>
              </li>
              <li>
                <a href='/contact' className='!text-gray-300 hover:text-white transition-colors text-sm'>
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h4 className='text-lg font-semibold text-white'>Kết nối</h4>
            <div className='flex space-x-4'>
              <a href='#' className='text-gray-300 hover:text-white transition-colors'>
                <Facebook size={20} className='text-white' />
              </a>
              <a href='#' className='text-gray-300 hover:text-white transition-colors'>
                <Twitter size={20} className='text-white' />
              </a>
              <a href='#' className='text-gray-300 hover:text-white transition-colors'>
                <Instagram size={20} className='text-white' />
              </a>
              <a href='#' className='text-gray-300 hover:text-white transition-colors'>
                <Linkedin size={20} className='text-white' />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-gray-600 pt-6 text-center'>
          <p className='text-gray-400 text-sm'>© 2025 VISUALIFY AI. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </Layout.Footer>
  )
}
