import { useState } from 'react'
import { Button, Card, Col, Row, Typography } from 'antd'
import { CreditCard, QrCode, CheckCircle, Clock } from 'lucide-react'
import { BankTransfer } from './components/payment-method/bank-transfer'
import { QRCode } from './components/payment-method/qr-code'
import type { UploadFile } from 'antd'
import { uploadBillApi } from '@/apis/payment/upload-bill'

const { Title, Text, Paragraph } = Typography

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  QR_CODE = 'qr_code'
}

enum PaymentStep {
  SELECT_METHOD = 1,
  ENTER_AMOUNT = 2,
  CONFIRMATION = 3
}

export const PaymentPage = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.SELECT_METHOD)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [submittedData, setSubmittedData] = useState<{
    amount: number
    billFile: UploadFile
    method: PaymentMethod
  } | null>(null)

  const REQUIRED_AMOUNT = 99000

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setCurrentStep(PaymentStep.ENTER_AMOUNT)
  }

  const handleAmountSubmit = async (amount: number, billFile: UploadFile) => {
    try {
      showLoading()
      if (amount === REQUIRED_AMOUNT && billFile) {
        await uploadBillApi({ billFile, amount })

        setSubmittedData({
          amount,
          billFile,
          method: selectedMethod!
        })
        setCurrentStep(PaymentStep.CONFIRMATION)
      }
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const handleBackToSelection = () => {
    setCurrentStep(PaymentStep.SELECT_METHOD)
    setSelectedMethod(null)
    setSubmittedData(null)
  }

  // render method selection
  const renderMethodSelection = () => (
    <div>
      <Title level={3} className='text-center !mb-8'>
        Chọn Hình Thức Thanh Toán
      </Title>

      <Row gutter={[24, 24]} className='max-w-2xl mx-auto'>
        <Col xs={24} md={12}>
          <Card
            hoverable
            className='h-full border-2 hover:border-blue-500 transition-all cursor-pointer'
            onClick={() => handleMethodSelect(PaymentMethod.BANK_TRANSFER)}
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
            onClick={() => handleMethodSelect(PaymentMethod.QR_CODE)}
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

  // render confirmation ui
  const renderConfirmation = () => (
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

      {/* Hiển thị thông tin đã gửi */}
      <Card className='!mb-6 text-left'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <Text strong>Phương thức:</Text>
            <Text>
              {submittedData?.method === PaymentMethod.BANK_TRANSFER ? '💳 Chuyển khoản ngân hàng' : '📱 Quét mã QR'}
            </Text>
          </div>
          <div className='flex justify-between'>
            <Text strong>Số tiền:</Text>
            <Text>{submittedData?.amount?.toLocaleString()} VNĐ</Text>
          </div>
          <div className='flex justify-between'>
            <Text strong>Biên lai:</Text>
            <Text className='!text-green-600'>✓ {submittedData?.billFile?.name}</Text>
          </div>
        </div>
      </Card>

      <Card className='!mb-6'>
        <div className='flex items-center gap-3 text-left'>
          <Clock size={20} className='text-green-500' />
          <div>
            <Text strong className='block'>
              Thời gian xử lý:
            </Text>
            <Text type='secondary'>Thường trong vòng 5-10 phút (đã có biên lai)</Text>
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
          để được hỗ trợ.
        </Text>
      </div>

      <Button type='default' size='large' className='mt-6' onClick={() => (window.location.href = '/')}>
        Quay về trang chủ
      </Button>
    </div>
  )

  return (
    <div className='min-h-screen bg-[#f8f9ff] py-14'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* header */}
        <div className='text-center mb-12'>
          <Title level={1} className='!text-4xl !font-bold !text-gray-900 !mb-4'>
            Thanh toán nâng cấp tài khoản
          </Title>
          <Paragraph className='!text-lg !text-gray-600'>
            Nâng cấp lên gói Chuyên nghiệp - {REQUIRED_AMOUNT.toLocaleString()} VNĐ/tháng
          </Paragraph>
        </div>

        {/* main content */}
        <Card className='shadow-lg border-0 !p-8'>
          {currentStep === PaymentStep.SELECT_METHOD && renderMethodSelection()}
          {currentStep === PaymentStep.ENTER_AMOUNT && selectedMethod === PaymentMethod.BANK_TRANSFER && (
            <BankTransfer
              onSubmit={handleAmountSubmit}
              onBackToSelection={handleBackToSelection}
              requiredAmount={REQUIRED_AMOUNT}
            />
          )}
          {currentStep === PaymentStep.ENTER_AMOUNT && selectedMethod === PaymentMethod.QR_CODE && (
            <QRCode
              onSubmit={handleAmountSubmit}
              onBackToSelection={handleBackToSelection}
              requiredAmount={REQUIRED_AMOUNT}
            />
          )}
          {currentStep === PaymentStep.CONFIRMATION && renderConfirmation()}
        </Card>
      </div>
    </div>
  )
}

export default PaymentPage
