import QRCodeImage from '@/assets/images/qr-payment.png'
import { Button, Card, Image, Input, Typography, Upload, message } from 'antd'
import { ArrowLeft, Upload as UploadIcon, FileText, X } from 'lucide-react'
import { useState } from 'react'
import type { UploadFile, UploadProps } from 'antd'

const { Title, Text } = Typography

interface QRCodeProps {
  onBackToSelection: () => void
  requiredAmount: number
  onSubmit: (amount: number, billFile: UploadFile) => void
}

export const QRCode = ({ onBackToSelection, requiredAmount, onSubmit }: QRCodeProps) => {
  const [enteredAmount, setEnteredAmount] = useState<number>(0)
  const [billFile, setBillFile] = useState<UploadFile | null>(null)

  const uploadProps: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept: '.jpg,.jpeg,.png,.pdf',
    beforeUpload: file => {
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf'
      if (!isValidType) {
        message.error('Chỉ hỗ trợ file JPG, PNG, PDF!')
        return false
      }

      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('File phải nhỏ hơn 5MB!')
        return false
      }

      setBillFile(file as UploadFile)
      return false // Prevent auto upload
    },
    onRemove: () => {
      setBillFile(null)
    },
    fileList: billFile ? [billFile] : []
  }

  const handleSubmit = () => {
    if (billFile) {
      onSubmit(enteredAmount, billFile)
    }
  }

  return (
    <div className='max-w-xl mx-auto'>
      <div className='flex items-center gap-2 mb-6'>
        <Button type='text' onClick={onBackToSelection} className='!p-0'>
          <ArrowLeft size={20} /> Quay lại
        </Button>
      </div>

      <Title level={3} className='text-center !mb-8'>
        📱 Quét mã QR
      </Title>

      <Card className='!mb-6 text-center'>
        <div className='py-8'>
          {/* Placeholder cho mã QR - trong thực tế sẽ tích hợp API ngân hàng */}
          <div className='w-54 h-54 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4'>
            <Image src={QRCodeImage} alt='QR Code' className='w-full h-full object-contain' />
          </div>
          <Text className='text-gray-600'>Mã QR thanh toán {requiredAmount} VNĐ</Text>
        </div>
      </Card>

      <div className='!mb-6'>
        <Text strong className='block mb-2'>
          Xác nhận số tiền:
        </Text>
        <Input
          size='large'
          placeholder='Nhập số tiền để xác minh (VD: 99000)'
          type='number'
          value={enteredAmount}
          onChange={e => setEnteredAmount(Number(e.target.value))}
          className='!h-12'
        />
        <Text type='secondary' className='text-sm mt-1 block'>
          Nhằm xác minh bạn biết chính xác số tiền: {requiredAmount} VNĐ
        </Text>
      </div>

      {/* Upload Bill Section */}
      <div className='!mb-6'>
        <Text strong className='block mb-2'>
          Tải lên biên lai <span className='text-red-500'>*</span>:
        </Text>

        {!billFile ? (
          <Upload.Dragger {...uploadProps} className='!mb-4'>
            <div className='p-6'>
              <UploadIcon size={48} className='text-gray-400 mx-auto mb-4' />
              <Text className='text-lg block mb-2'>Kéo thả file hoặc nhấn để chọn</Text>
              <Text type='secondary' className='text-sm'>
                Hỗ trợ: JPG, PNG, PDF (tối đa 5MB)
              </Text>
            </div>
          </Upload.Dragger>
        ) : (
          <Card className='!mb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <FileText size={24} className='text-green-500' />
                <div>
                  <Text strong className='block'>
                    {billFile.name}
                  </Text>
                  <Text type='secondary' className='text-sm'>
                    {Math.round((billFile.size || 0) / 1024)} KB
                  </Text>
                </div>
              </div>
              <Button
                type='text'
                icon={<X size={16} />}
                onClick={() => setBillFile(null)}
                className='!text-red-500 hover:!text-red-700'
              />
            </div>
          </Card>
        )}

        <Text type='secondary' className='text-xs block !text-red-500'>
          Bắt buộc phải tải lên biên lai để xác nhận thanh toán
        </Text>
      </div>

      <Button
        type='default'
        size='large'
        className='w-full btn-base-secondary !text-white'
        onClick={handleSubmit}
        disabled={enteredAmount !== requiredAmount || !billFile}
      >
        Xác nhận đã chuyển khoản
      </Button>

      <div className='mt-6 p-4 bg-green-50 rounded-lg'>
        <Text className='text-green-700'>
          🔒 <strong>Lưu ý:</strong> Vui lòng đảm bảo số tiền và nội dung chuyển khoản chính xác để được xử lý tự động.
        </Text>
      </div>
    </div>
  )
}
