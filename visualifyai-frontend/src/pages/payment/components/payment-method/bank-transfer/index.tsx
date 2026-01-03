import { Button, Card, Divider, Input, Typography, Upload, message } from 'antd'
import { ArrowLeft, Upload as UploadIcon, FileText, X } from 'lucide-react'
import { useState } from 'react'
import type { UploadFile, UploadProps } from 'antd'
const { Title, Text } = Typography

interface BankTransferProps {
  onSubmit: (amount: number, billFile: UploadFile) => void
  onBackToSelection: () => void
  requiredAmount: number
}
export const BankTransfer = ({ onSubmit, onBackToSelection, requiredAmount }: BankTransferProps) => {
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
        💳 Chuyển khoản ngân hàng
      </Title>

      <Card className='!mb-6'>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <Text strong>Số tài khoản:</Text>
            <Text copyable className='text-lg font-mono'>
              1234567890
            </Text>
          </div>

          <Divider className='!my-3' />

          <div className='flex justify-between items-center'>
            <Text strong>Ngân hàng:</Text>
            <Text className='text-lg'>MB Bank</Text>
          </div>

          <Divider className='!my-3' />

          <div className='flex justify-between items-center'>
            <Text strong>Chủ tài khoản:</Text>
            <Text className='text-lg'>Phạm Hồng Thái</Text>
          </div>
        </div>
      </Card>

      <div className='!mb-6'>
        <Text strong className='block mb-2'>
          Số tiền cần thanh toán:
        </Text>
        <Input
          size='large'
          type='number'
          placeholder='Nhập số tiền (VD: 99000)'
          value={enteredAmount}
          onChange={e => setEnteredAmount(Number(e.target.value))}
          className='!h-12'
        />
        <Text type='secondary' className='text-sm mt-1 block'>
          Yêu cầu nhập đúng số tiền: {requiredAmount}
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
                <FileText size={24} className='text-blue-500' />
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

      <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
        <Text className='text-blue-700'>
          🔒 <strong>Lưu ý:</strong> Vui lòng nhập đúng số tiền để hệ thống tự động xác nhận nâng cấp tài khoản.
        </Text>
      </div>
    </div>
  )
}
