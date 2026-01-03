import { PenIcon } from '@/components/icons/pen-icon'
import { ThemeIcon } from '@/components/icons/theme-icon'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import DashboardImage from '@/assets/images/dashboard.png'
import { useNavigate } from 'react-router-dom'
import { PaymentPackage } from '@/types/common'

const { Title, Paragraph } = Typography

function HomePage() {
  const navigate = useNavigate()
  return (
    <div className='relative bg-[#f8f9ff] min-h-screen overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#e6ecff]/50 -translate-x-1/2 -translate-y-1/2 z-0'></div>
      <div className='absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full bg-[#e6ecff]/50 translate-y-1/2 z-0'></div>

      <div className='max-w-7xl mx-auto px-4 relative z-10'>
        {/* Hero section */}
        <section className='py-16 md:py-24'>
          <Row gutter={[32, 48]} align='middle'>
            <Col xs={24} lg={12} className='relative'>
              <div className='space-y-6 pr-0 md:pr-6'>
                <Title level={1} className='!text-4xl md:!text-5xl !font-bold !mb-4 !text-[#121212]'>
                  Tạo Infographic đẹp mắt được hỗ trợ bởi AI
                </Title>
                <Paragraph className='!text-base md:!text-lg !mb-8 !text-gray-700'>
                  Biến đữ liệu của bạn thành những câu chuyện trực quan tuyệt đẹp bằng trình tạo đồ họa thông tin hỗ trợ
                  AI mà không cần kỹ năng thiết kế.
                </Paragraph>
                <Space size='middle'>
                  <Button
                    type='primary'
                    size='large'
                    className='btn-base-secondary'
                    onClick={() => navigate('/create-infographic')}
                  >
                    Bắt đầu tạo ngay
                    <ChevronRight size={18} className='ml-1' />
                  </Button>
                  <Button type='default' size='large' className='flex items-center !h-12 !px-6 text-gray-700 '>
                    Xem Demo
                    <ArrowRight size={16} className='ml-1' />
                  </Button>
                </Space>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className='bg-[#244277] p-6 rounded-xl shadow-xl max-w-[500px] mx-auto'>
                <img src={DashboardImage} alt='Infographic Preview' className='w-full h-auto rounded shadow-lg' />
              </div>
            </Col>
          </Row>
        </section>

        {/* Feature Title */}
        <section className='text-center pt-8'>
          <Title level={2} className='!text-3xl !mb-4 !font-bold'>
            Các tính năng tuyệt vời cho Infographic của bạn
          </Title>
          <Paragraph className='!text-lg !text-gray-700 max-w-2xl mx-auto'>
            Tạo những infographic chuyên nghiệp chỉ với vài cú nhấp chuột
          </Paragraph>
        </section>

        {/* Features section */}
        <section className='py-16'>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} lg={8}>
              <Card className='h-full border-none shadow-md hover:shadow-lg transition-all bg-gradient-light-sky'>
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-[#E0E7FF] p-3 rounded-xl mb-4'>
                    <PenIcon />
                  </div>
                  <Title level={4} className='mb-3 !font-bold'>
                    Tạo infographic bằng AI
                  </Title>
                  <Paragraph className='!text-gray-700 !text-[16px]'>
                    Chuyển đổi văn bản và dữ liệu của bạn thành hình ảnh trực quan infographic hấp dẫn chỉ với một cú
                    nhấp chuột
                  </Paragraph>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card className='h-full border-none shadow-md hover:shadow-lg transition-all bg-gradient-light-pink'>
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-[#E0E7FF] p-3 rounded-xl mb-4'>
                    <ThemeIcon />
                  </div>
                  <Title level={4} className='mb-3 !font-bold'>
                    Mẫu tùy chỉnh
                  </Title>
                  <Paragraph className='!text-gray-700 !text-[16px]'>
                    Chọn từ hàng trăm mẫu được thiết kế chuyên nghiệp cho bất kỳ chủ đề nào
                  </Paragraph>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card className='h-full border-none shadow-md hover:shadow-lg transition-all bg-gradient-light-orange '>
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-[#E0E7FF] p-3 rounded-xl mb-4'>
                    <ThemeIcon />
                  </div>
                  <Title level={4} className='mb-3 !font-bold'>
                    Trực quan hóa dữ liệu thông minh
                  </Title>
                  <Paragraph className='!text-gray-700 !text-[16px]'>
                    Tự động chuyển đổi dữ liệu của bạn thành biểu đồ và đồ thị đẹp mắt
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </section>

        <section className='py-16'>
          <div className='text-center mb-16'>
            <Title level={2} className='!text-3xl !mb-4 !font-bold'>
              Nó hoạt động như thế nào
            </Title>
            <Paragraph className='!text-lg !text-gray-700 max-w-2xl mx-auto'>
              Tạo infographics chuyên nghiệp chỉ trong ba bước
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify='center'>
            <Col xs={24} sm={8} lg={6}>
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mb-6'>
                  <span className='text-white text-xl font-bold'>1</span>
                </div>
                <Title level={4} className='!mb-3 !font-bold'>
                  Nhập nội dung của bạn
                </Title>
                <Paragraph className='!text-gray-700 !text-[16px]'>
                  Nhập văn bản, dữ liệu hoặc tải lên các tập tin của bạn
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} sm={8} lg={6}>
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-[#EF4444] rounded-full flex items-center justify-center mb-6'>
                  <span className='text-white text-xl font-bold'>2</span>
                </div>
                <Title level={4} className='!mb-3 !font-bold'>
                  Chọn phong cách
                </Title>
                <Paragraph className='!text-gray-700 !text-[16px]'>
                  Chọn từ nhiều mẫu khác nhau và tùy chỉnh màu sắc
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} sm={8} lg={6}>
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center mb-6'>
                  <span className='text-white text-xl font-bold'>3</span>
                </div>
                <Title level={4} className='!mb-3 !font-bold'>
                  Tạo & Tải xuống
                </Title>
                <Paragraph className='!text-gray-700 !text-[16px]'>Nhận infographic chỉ trong vài giây</Paragraph>
              </div>
            </Col>
          </Row>
        </section>

        {/* Pricing section */}
        <section className='py-16'>
          <div className='text-center mb-8'>
            <Title level={2} className='!text-3xl !mb-4 !font-bold'>
              Giá cả hợp lý, minh bạch
            </Title>
            <Paragraph className='!text-lg !text-gray-700 max-w-2xl mx-auto'>Chọn gói cho phù hợp của bạn</Paragraph>
          </div>

          <Row gutter={[32, 32]} justify='center'>
            {/* Gói Cơ bản */}
            <Col xs={24} sm={12} lg={8}>
              <Card className='h-full border border-gray-200 shadow-md hover:shadow-lg transition-all'>
                <div className='text-center'>
                  <div className='mb-4'>
                    <span className='text-base tracking-wide'>Cơ bản</span>
                  </div>
                  <div className='mb-6'>
                    <span className='text-3xl font-bold'>Miễn phí</span>
                  </div>
                  <div className='text-left space-y-3 mb-8'>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-green-500' />
                      <span className='text-gray-700'>Chỉ miễn phí 3 template đầu tiên</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-green-500' />
                      <span className='text-gray-700'>Chỉ sử dụng giao diện cơ bản</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-green-500' />
                      <span className='text-gray-700'>Tải về định dạng PNG</span>
                    </div>
                  </div>
                  <Button
                    type='default'
                    size='large'
                    className='btn-text-base'
                    onClick={() => navigate('/create-infographic')}
                  >
                    Bắt đầu ngay
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Gói Nâng cao - Highlighted */}
            <Col xs={24} sm={12} lg={8}>
              <Card className='h-full border-2 shadow-lg hover:shadow-xl transition-all !bg-[var(--primary)] text-white relative'>
                <div className='text-center'>
                  <div className='mb-4'>
                    <span className='text-base tracking-wide text-white'>Nâng cao</span>
                  </div>
                  <div className='mb-6'>
                    <span className='text-3xl font-bold text-white'>99,000 Đ/tháng</span>
                  </div>
                  <div className='text-left space-y-3 mb-8'>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-white' />

                      <span className='text-blue-100'>Không giới hạn infographics</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-white' />

                      <span className='text-blue-100'>Được sử dụng nhiều cao cấp</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-white' />

                      <span className='text-blue-100'>AI hỗ trợ thành tài</span>
                    </div>
                  </div>
                  <Button
                    type='default'
                    size='large'
                    className='btn-text-base text-primary'
                    onClick={() => navigate(`/payment?package=${PaymentPackage.PRO}`)}
                  >
                    Bắt đầu ngay
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Gói Doanh nghiệp */}
            <Col xs={24} sm={12} lg={8}>
              <Card className='h-full border border-gray-200 shadow-md hover:shadow-lg transition-all'>
                <div className='text-center'>
                  <div className='mb-4'>
                    <span className='text-sm text-gray-600 tracking-wide'>Doanh nghiệp</span>
                  </div>
                  <div className='mb-6'>
                    <span className='text-3xl font-bold'>Tùy chỉnh</span>
                  </div>
                  <div className='text-left space-y-3 mb-8'>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-green-500' />
                      <span className='text-gray-700'>Giải pháp tùy chỉnh</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-green-500' />
                      <span className='text-gray-700'>Ưu tiên API</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Check size={16} className='text-green-500' />
                      <span className='text-gray-700'>Hỗ trợ chuyên dụng</span>
                    </div>
                  </div>
                  <Button type='default' size='large' className='btn-text-base'>
                    Liên hệ
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  )
}

export default HomePage
