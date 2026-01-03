import { Button, Card, Typography } from 'antd'
import { CheckCircle, Clock } from 'lucide-react'

const { Title, Text, Paragraph } = Typography
export const PaymentConfirm = () => {
  return (
    <div className='max-w-xl mx-auto text-center'>
      <div className='mb-8'>
        <CheckCircle size={64} className='text-green-500 mx-auto mb-4' />
        <Title level={3} className='!text-green-600 !mb-4'>
          ✅ Cảm ơn bạn đã thanh toán!
        </Title>
        <Paragraph className='text-lg text-gray-600'>
          Hệ thống sẽ tự động nâng cấp sau khi xác minh giao dịch.
        </Paragraph>
      </div>

      <Card className='!mb-6'>
        <div className='flex items-center gap-3 text-left'>
          <Clock size={20} className='text-orange-500' />
          <div>
            <Text strong className='block'>
              Thời gian xử lý:
            </Text>
            <Text type='secondary'>Thường trong vòng 15 phút</Text>
          </div>
        </div>
      </Card>

      <div className='p-4 bg-orange-50 rounded-lg'>
        <Text className='text-orange-700'>
          🕒 <strong>Chưa xác nhận tự động trong 15 phút?</strong>
          <br />
          Vui lòng liên hệ hỗ trợ qua{' '}
          <a
            href='https://zalo.me/support'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 underline'
          >
            Zalo
          </a>{' '}
          để gửi biên lai thanh toán.
        </Text>
      </div>

      <Button type='default' size='large' className='mt-6' onClick={() => (window.location.href = '/')}>
        Quay về trang chủ
      </Button>
    </div>
  )
}
