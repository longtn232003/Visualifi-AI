import { Button, Card, Col, Form, Input, Row, Select, Upload as AntUpload, Typography } from 'antd'
import { useState } from 'react'
import { FileText, Upload, Zap, File, Image as ImageIcon } from 'lucide-react'
import { infographicFormatOptions, infographicStyleOptions } from '../../infographic-const'
import { InfographicSize, InfographicStyle } from '@/types/infographic'
import { RcFile } from 'antd/lib/upload'

const { TextArea } = Input
const { Dragger } = AntUpload
const { Text, Paragraph } = Typography

export enum FormPromptTab {
  TOPIC = 'topic',
  UPLOAD = 'upload'
}

export interface FormPromptValues {
  prompt: string
  style: InfographicStyle
  format: InfographicSize
}

interface FormPromptProps {
  onSubmit: (values: FormPromptValues, activeTab: FormPromptTab) => void
}

export const FormPrompt = ({ onSubmit }: FormPromptProps) => {
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState(FormPromptTab.TOPIC)
  const [fileList, setFileList] = useState<any[]>([])

  const handleTabChange = (tab: FormPromptTab) => {
    setActiveTab(tab)
    form.setFieldsValue({ prompt: '' })
    setFileList([])
  }

  // Chỉ xử lý lưu file trong state, không đọc nội dung
  const handleFileUpload = (file: RcFile) => {
    setFileList([file])
    return false
  }

  const handleRemoveFile = () => {
    setFileList([])
    form.setFieldsValue({ prompt: '' })
  }

  return (
    <section>
      <Card className='shadow-lg border-none !p-4'>
        <Form
          form={form}
          layout='vertical'
          onFinish={values => {
            onSubmit(values, activeTab)
          }}
          initialValues={{
            style: InfographicStyle.MODERN,
            format: InfographicSize.SIZE_11
          }}
        >
          {/* Custom Tabs */}
          <div className='flex mb-8 gap-2'>
            <Button
              type={activeTab === FormPromptTab.TOPIC ? 'primary' : 'default'}
              onClick={() => handleTabChange(FormPromptTab.TOPIC)}
              className={`!px-6 !py-3 !h-auto rounded-r-none ${
                activeTab === FormPromptTab.TOPIC
                  ? '!bg-gray-200 !border-gray-300 !font-medium !text-black'
                  : '!bg-white !border-gray-300 !text-gray-900 !font-medium'
              }`}
            >
              Nhập chủ đề của bạn
            </Button>
            <Button
              type={activeTab === FormPromptTab.UPLOAD ? 'primary' : 'default'}
              onClick={() => handleTabChange(FormPromptTab.UPLOAD)}
              className={`!px-6 !py-3 !h-auto rounded-l-none ${
                activeTab === FormPromptTab.UPLOAD
                  ? '!bg-gray-200 !border-gray-300 !font-medium !text-black'
                  : '!bg-white !border-gray-300 !text-gray-900 !font-medium'
              }`}
            >
              Tải lên tập tin
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === FormPromptTab.TOPIC && (
            <div className='mb-8'>
              <Form.Item label='Nhập dữ liệu của bạn' name='prompt'>
                <TextArea
                  placeholder='Nhập nội dung của bạn'
                  rows={3}
                  className='!text-base !resize-none'
                  style={{ fontSize: '16px' }}
                />
              </Form.Item>
            </div>
          )}

          {activeTab === FormPromptTab.UPLOAD && (
            <div className='mb-8'>
              <Form.Item
                label='Tải lên tập tin của bạn'
                name='prompt'
                help={
                  <Text type='secondary' className='text-xs'>
                    Hỗ trợ tập tin: .txt, .docx, .pdf, .csv, .xlsx (tối đa 5MB)
                  </Text>
                }
              >
                {fileList.length > 0 ? (
                  <div className='flex items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                    <FileText size={24} className='text-blue-500' />
                    <div className='flex-1'>
                      <Text className='font-medium block'>{fileList[0]?.name}</Text>
                      <Text type='secondary' className='text-xs'>
                        {Math.round((fileList[0]?.size || 0) / 1024)} KB
                      </Text>
                    </div>
                    <Button type='text' className='!text-red-500 !hover:text-red-700' onClick={handleRemoveFile}>
                      Xóa
                    </Button>
                  </div>
                ) : (
                  <Dragger
                    accept='.txt,.doc,.docx,.pdf,.csv,.xlsx,.xls'
                    maxCount={1}
                    fileList={fileList}
                    beforeUpload={handleFileUpload}
                    showUploadList={false}
                    className='!bg-gray-50 !border-dashed !border-gray-300 hover:!border-blue-400 transition-colors'
                  >
                    <div className='p-6'>
                      <p className='flex justify-center mb-2'>
                        <Upload size={32} className='text-blue-500' />
                      </p>
                      <Paragraph className='text-gray-600'>
                        <Text strong>Kéo thả tập tin vào đây</Text> hoặc{' '}
                        <Text strong className='text-blue-500'>
                          nhấn để tải lên
                        </Text>
                      </Paragraph>
                      <div className='flex justify-center gap-4 mt-4'>
                        <div className='text-center'>
                          <File size={20} className='mx-auto mb-1 text-gray-500' />
                          <Text className='text-xs text-gray-500'>TXT</Text>
                        </div>
                        <div className='text-center'>
                          <FileText size={20} className='mx-auto mb-1 text-gray-500' />
                          <Text className='text-xs text-gray-500'>DOCX</Text>
                        </div>
                        <div className='text-center'>
                          <ImageIcon size={20} className='mx-auto mb-1 text-gray-500' />
                          <Text className='text-xs text-gray-500'>PDF</Text>
                        </div>
                      </div>
                    </div>
                  </Dragger>
                )}
              </Form.Item>
            </div>
          )}

          {/* Options - Hiển thị ở cả hai tab */}
          <Row gutter={[18, 18]} className='mb-6'>
            <Col xs={12} sm={8}>
              <div className='flex gap-2 items-center'>
                <Form.Item name='style' className='!mb-0 min-w-[120px]'>
                  <Select className='!w-full' size='middle' options={infographicStyleOptions} />
                </Form.Item>

                <span className='text-sm'>Phong cách</span>
              </div>
            </Col>

            <Col xs={12} sm={8}>
              <div className='flex gap-2 items-center flex-1'>
                <Form.Item name='format' className='!mb-0 min-w-[120px]'>
                  <Select size='middle' options={infographicFormatOptions} />
                </Form.Item>
                <span className='text-sm'>Định dạng</span>
              </div>
            </Col>
          </Row>

          {/* Create Button */}
          <div className='text-center'>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                icon={<Zap size={16} className='mr-1' />}
                className='btn-base-secondary'
                disabled={activeTab === FormPromptTab.UPLOAD && fileList.length === 0}
              >
                Tạo infographic
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </section>
  )
}
