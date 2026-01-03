import { PaymentMethod } from '@/pages/payment'
import { Card, Typography } from 'antd'
import { Row } from 'antd'
import { Col } from 'antd'
import { CreditCard, QrCode } from 'lucide-react'

const { Title, Text } = Typography

interface SelectMethodProps {
  onSelectMethod: (method: PaymentMethod) => void
}

export const SelectMethod = ({ onSelectMethod }: SelectMethodProps) => {
  return (
    <div>
      <Title level={3} className='text-center !mb-8'>
        Chọn Hình Thức Thanh Toán
      </Title>

      <Row gutter={[24, 24]} className='max-w-2xl mx-auto'>
        <Col xs={24} md={12}>
          <Card
            hoverable
            className='h-full border-2 hover:border-blue-500 transition-all cursor-pointer'
            onClick={() => onSelectMethod(PaymentMethod.BANK_TRANSFER)}
          >
            <div className='text-center py-6'>
              <CreditCard size={48} className='text-blue-500 mx-auto mb-4' />
              <Title level={4} className='!mb-2'>
                💳 Chuyển khoản ngân hàng
              </Title>
              <Text className='text-gray-600'>Chuyển khoản trực tiếp qua ngân hàng</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            hoverable
            className='h-full border-2 hover:border-blue-500 transition-all cursor-pointer'
            onClick={() => onSelectMethod(PaymentMethod.QR_CODE)}
          >
            <div className='text-center py-6'>
              <QrCode size={48} className='text-green-500 mx-auto mb-4' />
              <Title level={4} className='!mb-2'>
                📱 Quét mã QR
              </Title>
              <Text className='text-gray-600'>Quét mã QR để thanh toán nhanh</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
