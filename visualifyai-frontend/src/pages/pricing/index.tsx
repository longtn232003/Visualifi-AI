import { Button, Card, Col, Row, Table, Typography } from 'antd'
import { Check, X } from 'lucide-react'

const { Title, Paragraph } = Typography

export default function PricingPage() {
  const pricingPlans = [
    {
      id: 'team',
      name: 'Nhóm',
      price: '349.000đ',
      period: 'Dành cho nhóm',
      isPopular: false,
      features: [
        '2-4 thành viên',
        'Tất cả tính năng gói chuyên nghiệp',
        'Kho tài nguyên chung',
        'Xuất PNG, JPG, PDF',
        'Ưu tiên hỗ trợ'
      ],
      buttonText: 'Đăng ký ngay',
      buttonType: 'default' as const
    },
    {
      id: 'professional',
      name: 'Chuyên nghiệp',
      price: '99.000đ',
      period: 'Dành cho cá nhân',
      isPopular: true,
      features: ['Tạo tối đa 50 infographic', 'Tất cả mẫu có sẵn', 'Xuất PNG, JPG, JPG', 'MIỄN PHÍ 3 LẦN ĐẦU TIÊN'],
      buttonText: 'Đăng ký ngay',
      buttonType: 'primary' as const
    },
    {
      id: 'enterprise',
      name: 'Doanh nghiệp',
      price: 'Liên hệ',
      period: 'Dành cho doanh nghiệp',
      isPopular: false,
      features: ['Tất cả tính năng gói nhóm', '5 thành viên', 'Quản lý nhóm', 'Phân quyền', 'API tích hợp'],
      buttonText: 'Liên hệ báo giá',
      buttonType: 'default' as const
    }
  ]

  const comparisonData = [
    {
      key: '1',
      feature: 'Số lượng infographic',
      professional: '50',
      team: '250',
      enterprise: 'Không giới hạn'
    },
    {
      key: '2',
      feature: 'Mẫu thiết kế',
      professional: 'Cao cấp',
      team: 'Premium',
      enterprise: 'Premium'
    },
    {
      key: '3',
      feature: 'Định dạng xuất',
      professional: 'PNG, PDF, JPG',
      team: 'PNG, PDF, JPG',
      enterprise: 'PNG, PDF, SVG'
    },
    {
      key: '4',
      feature: 'Hỗ trợ',
      professional: 'Ưu tiên',
      team: 'Ưu tiên',
      enterprise: '24/7'
    },
    {
      key: '5',
      feature: 'Thành viên',
      professional: '1',
      team: '2-4',
      enterprise: '5'
    },
    {
      key: '6',
      feature: 'API tích hợp',
      professional: false,
      team: false,
      enterprise: true
    }
  ]

  const columns = [
    {
      title: 'Tính năng',
      dataIndex: 'feature',
      key: 'feature',
      width: '25%',
      className: 'font-medium'
    },
    {
      title: 'Chuyên nghiệp',
      dataIndex: 'professional',
      key: 'professional',
      width: '25%',
      align: 'center' as const,
      render: (value: any) => {
        if (typeof value === 'boolean') {
          return value ? (
            <Check size={16} className='text-green-500 mx-auto' />
          ) : (
            <X size={16} className='text-red-500 mx-auto' />
          )
        }
        return value
      }
    },
    {
      title: 'Nhóm',
      dataIndex: 'team',
      key: 'team',
      width: '25%',
      align: 'center' as const,
      render: (value: any) => {
        if (typeof value === 'boolean') {
          return value ? (
            <Check size={16} className='text-green-500 mx-auto' />
          ) : (
            <X size={16} className='text-red-500 mx-auto' />
          )
        }
        return value
      }
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'enterprise',
      key: 'enterprise',
      width: '25%',
      align: 'center' as const,
      render: (value: any) => {
        if (typeof value === 'boolean') {
          return value ? (
            <Check size={16} className='text-green-500 mx-auto' />
          ) : (
            <X size={16} className='text-red-500 mx-auto' />
          )
        }
        return value
      }
    }
  ]

  return (
    <div className='min-h-screen bg-[#f8f9ff] py-14'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <Title level={1} className='!text-4xl !font-bold !text-gray-900 !mb-4'>
            Bảng giá dịch vụ
          </Title>
          <Paragraph className='!text-lg !text-gray-600 max-w-2xl mx-auto'>
            Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn
          </Paragraph>
        </div>

        {/* Pricing Cards */}
        <Row gutter={[24, 24]} className='mb-16'>
          {pricingPlans.map(plan => (
            <Col key={plan.id} xs={24} md={8}>
              <Card
                className={`h-full text-center relative flex flex-col ${
                  plan.isPopular
                    ? 'border-2 border-blue-500 shadow-xl !bg-blue-600 text-white'
                    : 'border border-gray-200 shadow-lg hover:shadow-xl transition-shadow'
                }`}
                bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {plan.isPopular && (
                  <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                    <span className='bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium'>
                      PHỔ BIẾN NHẤT
                    </span>
                  </div>
                )}

                <div className='py-6 px-6 flex flex-col h-full'>
                  {/* Plan Name */}
                  <Title level={3} className={`!mb-4 !font-bold ${plan.isPopular ? '!text-white' : '!text-gray-900'}`}>
                    {plan.name}
                  </Title>

                  {/* Price */}
                  <div className='mb-2'>
                    <span className={`text-3xl font-bold ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                  </div>

                  {/* Period */}
                  <Paragraph className={`!mb-8 ${plan.isPopular ? '!text-blue-100' : '!text-gray-600'}`}>
                    {plan.period}
                  </Paragraph>

                  {/* Features */}
                  <div className='text-left mb-8 space-y-3 flex-grow'>
                    {plan.features.map((feature, index) => (
                      <div key={index} className='flex items-center gap-3'>
                        <Check size={16} className={plan.isPopular ? 'text-white' : 'text-green-500'} />
                        <span className={`text-sm ${plan.isPopular ? 'text-blue-100' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <div className='mt-auto'>
                    <Button
                      type={plan.isPopular ? 'default' : plan.buttonType}
                      size='large'
                      className={'btn-text-base'}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Comparison Table */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <Title level={2} className='!text-2xl !font-bold !text-gray-900 !mb-6 text-center'>
            So sánh tính năng các gói
          </Title>

          <Table
            columns={columns}
            dataSource={comparisonData}
            pagination={false}
            className='comparison-table'
            bordered
          />
        </div>
      </div>
    </div>
  )
}
