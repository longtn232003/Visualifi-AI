import { adminConfirmPaymentApi, adminGetPaymentDetailsApi } from '@/apis/payment/confirm-payment'
import { PaymentData, PaymentStatus } from '@/types/payment'
import { getUrlUpload } from '@/utils/common'
import { Button, Card, Col, Descriptions, Image, Input, Modal, Row, Space, Tag, Typography } from 'antd'
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, FileImage, Mail, User, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// import { confirmPaymentApi, adminGetPaymentDetailsApi } from '@/apis/payment/confirm-payment'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const PaymentConfirmPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const navigate = useNavigate()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [actionModalVisible, setActionModalVisible] = useState(false)
  const [currentAction, setCurrentAction] = useState<PaymentStatus | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (token) {
      fetchPaymentDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const fetchPaymentDetails = async () => {
    if (!token) return

    try {
      showLoading()
      const response = await adminGetPaymentDetailsApi(token)
      setPaymentData(response.data)
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const handleOpenActionModal = (action: PaymentStatus) => {
    setCurrentAction(action)
    setActionModalVisible(true)
    setReason('')
  }

  const handleCloseModal = () => {
    setActionModalVisible(false)
    setCurrentAction(null)
    setReason('')
  }

  const handleConfirmPayment = async () => {
    if (!token || !currentAction) return

    try {
      showLoading()

      await adminConfirmPaymentApi({ token, status: currentAction, adminNote: reason })

      if (paymentData) {
        setPaymentData({
          ...paymentData,
          status: currentAction
        })
      }

      showToast({
        type: 'success',
        message:
          currentAction === PaymentStatus.CONFIRMED ? 'Thanh toán đã được phê duyệt!' : 'Thanh toán đã bị từ chối!'
      })

      handleCloseModal()
    } catch {
      showToast({
        type: 'error',
        message: 'Có lỗi xảy ra, vui lòng thử lại'
      })
    } finally {
      hideLoading()
    }
  }

  const getStatusTag = (status: PaymentStatus) => {
    const statusConfig = {
      [PaymentStatus.PENDING]: { color: 'orange', text: 'Chờ xử lý', icon: <Clock size={14} /> },
      [PaymentStatus.CONFIRMED]: { color: 'green', text: 'Đã phê duyệt', icon: <CheckCircle size={14} /> },
      [PaymentStatus.REJECTED]: { color: 'red', text: 'Đã từ chối', icon: <XCircle size={14} /> }
    }

    const config = statusConfig[status]
    return (
      <Tag color={config.color} className='!flex items-center gap-1 !w-fit'>
        {config.icon}
        {config.text}
      </Tag>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModalConfig = () => {
    if (currentAction === PaymentStatus.CONFIRMED) {
      return {
        title: '✅ Phê duyệt thanh toán',
        confirmText: 'Xác nhận phê duyệt',
        confirmType: 'primary' as const,
        placeholder: 'Nhập lý do phê duyệt (không bắt buộc)',
        description: 'Bạn có chắc chắn muốn phê duyệt thanh toán này?',
        className: 'bg-green-500 hover:bg-green-600 border-green-500'
      }
    } else {
      return {
        title: '❌ Từ chối thanh toán',
        confirmText: 'Xác nhận từ chối',
        confirmType: 'primary' as const,
        placeholder: 'Nhập lý do từ chối (bắt buộc)',
        description: 'Bạn có chắc chắn muốn từ chối thanh toán này?',
        className: ''
      }
    }
  }

  if (!paymentData) {
    return (
      <div className='min-h-screen bg-[#f8f9ff] py-14 flex items-center justify-center'>
        <Card className='p-8 text-center'>
          <Title level={4} className='!text-red-500'>
            Không tìm thấy thông tin thanh toán
          </Title>
          <Button onClick={() => navigate(-1)} className='mt-4'>
            Quay lại
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#f8f9ff] py-14'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <Button type='text' icon={<ArrowLeft size={20} />} onClick={() => navigate(-1)} className='mb-4'>
            Quay lại
          </Button>

          <div className='flex items-center justify-between'>
            <div>
              <Title level={2} className='!mb-2'>
                Xác nhận thanh toán
              </Title>
              <Paragraph className='!text-gray-600'>Xem xét và phê duyệt yêu cầu thanh toán từ người dùng</Paragraph>
            </div>
            {getStatusTag(paymentData.status)}
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Thông tin thanh toán */}
          <Col xs={24} lg={14}>
            <Card title='Thông tin thanh toán' className='mb-6'>
              <Descriptions column={1} bordered>
                <Descriptions.Item
                  label={
                    <>
                      <DollarSign size={16} className='mr-2' />
                      Số tiền
                    </>
                  }
                >
                  <Text strong className='text-lg !text-green-600'>
                    {paymentData.amount.toLocaleString('en')} VNĐ
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <>
                      <Calendar size={16} className='mr-2' />
                      Thời gian
                    </>
                  }
                >
                  {formatDate(paymentData.createdAt)}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <>
                      <FileImage size={16} className='mr-2' />
                      Trạng thái
                    </>
                  }
                >
                  {getStatusTag(paymentData.status)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Thông tin người dùng */}
            <Card title='Thông tin người dùng'>
              <Descriptions column={1} bordered>
                <Descriptions.Item
                  label={
                    <>
                      <User size={16} className='mr-2' />
                      Họ tên
                    </>
                  }
                >
                  {paymentData.user.fullName}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <>
                      <Mail size={16} className='mr-2' />
                      Email
                    </>
                  }
                >
                  <a href={`mailto:${paymentData.user.email}`}>{paymentData.user.email}</a>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <>
                      <User size={16} className='mr-2' />
                      ID người dùng
                    </>
                  }
                >
                  {paymentData.user.id}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Biên lai thanh toán */}
          <Col xs={24} lg={10}>
            <Card title='Biên lai thanh toán' className='h-fit'>
              <div className='text-center'>
                {/* Mock image - sử dụng placeholder thay vì real API */}
                <div className='w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center'>
                  <Image src={getUrlUpload(paymentData.billImagePath)} alt='Biên lai thanh toán' />
                </div>
                <Paragraph className='mt-4 text-gray-600'>
                  Biên lai thanh toán {paymentData.amount.toLocaleString('en')} VNĐ
                </Paragraph>
              </div>
            </Card>

            <Card className='mt-6'>
              <div className='text-center'>
                <Title level={4} className='mb-6'>
                  Xác nhận thanh toán
                </Title>

                {paymentData.status === PaymentStatus.PENDING ? (
                  <>
                    <Space size='large'>
                      <Button
                        type='primary'
                        size='large'
                        icon={<CheckCircle size={20} />}
                        onClick={() => handleOpenActionModal(PaymentStatus.CONFIRMED)}
                        className='bg-green-500 hover:bg-green-600 border-green-500 min-w-[140px]'
                      >
                        Phê duyệt
                      </Button>

                      <Button
                        type='primary'
                        size='large'
                        danger
                        icon={<XCircle size={20} />}
                        onClick={() => handleOpenActionModal(PaymentStatus.REJECTED)}
                        className='min-w-[140px]'
                      >
                        Từ chối
                      </Button>
                    </Space>

                    <Paragraph className='mt-4 text-gray-600'>
                      Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
                    </Paragraph>
                  </>
                ) : (
                  <div className='text-center py-8'>
                    {getStatusTag(paymentData.status)}
                    <Paragraph className='mt-4 text-gray-600'>Thanh toán này đã được xử lý</Paragraph>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Action Modal */}
        <Modal
          title={getModalConfig().title}
          open={actionModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key='cancel' onClick={handleCloseModal}>
              Hủy
            </Button>,
            <Button
              key='confirm'
              type={getModalConfig().confirmType}
              onClick={handleConfirmPayment}
              danger={currentAction === PaymentStatus.REJECTED}
              className={
                currentAction === PaymentStatus.CONFIRMED ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''
              }
            >
              {getModalConfig().confirmText}
            </Button>
          ]}
        >
          <Paragraph className='mb-4'>{getModalConfig().description}</Paragraph>

          <TextArea
            placeholder={getModalConfig().placeholder}
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={4}
          />
        </Modal>
      </div>
    </div>
  )
}

export default PaymentConfirmPage
