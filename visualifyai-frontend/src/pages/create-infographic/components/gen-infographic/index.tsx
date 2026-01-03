import imageSample1 from '@/assets/images/image-sample1.jpg'
import imageSample2 from '@/assets/images/image-sample2.jpg'
import imageSample3 from '@/assets/images/image-sample3.jpg'
import { Card, Col, Row } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import Title from 'antd/es/typography/Title'
import { ChatMessage } from '../..'
import { ChatHistory } from '../chat-history'
import { FormPrompt, FormPromptTab, FormPromptValues } from '../form-prompt'

interface GenInfographicProps {
  image?: string
  onEditInfographic: () => void
  onGenerateInfographic: (values: FormPromptValues, activeTab: FormPromptTab) => void
  onSaveToLibrary: (id: number) => void
  messages: ChatMessage[]
}

export const GenInfographic = ({
  onEditInfographic,
  onGenerateInfographic,
  onSaveToLibrary,
  messages
}: GenInfographicProps) => {
  const handleGenerateInfographic = (values: FormPromptValues, activeTab: FormPromptTab) => {
    onGenerateInfographic(values, activeTab)
  }

  const handleDownload = (id: number) => {
    console.log('id', id)
    // if (id) {
    //   const link = document.createElement('a')
    //   link.href = `${API_URL}/${imagePath}`
    //   link.download = `infographic-${new Date().getTime()}.jpg`
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white py-14 create-infographic-page'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <Title level={1} className='!text-4xl !font-bold !text-gray-900 !mb-4'>
            Tạo Infographics tuyệt vời với AI
          </Title>
          <Paragraph className='!text-lg !text-gray-600 max-w-2xl mx-auto'>
            Biến ý tưởng của bạn thành infographic tuyệt đẹp chỉ trong vài giây bằng công nghệ AI tiên tiến của chúng
            tôi mà không cần kỹ năng thiết kế.
          </Paragraph>
        </div>

        {/* Main Form */}
        <FormPrompt onSubmit={handleGenerateInfographic} />

        {/* Chat History */}
        {messages.length > 0 && (
          <ChatHistory
            messages={messages}
            onEditInfographic={onEditInfographic}
            onSaveToLibrary={onSaveToLibrary}
            onDownload={handleDownload}
          />
        )}

        {/* Samples section - only visible when no messages */}
        {messages.length === 0 && (
          <>
            <section className='mt-14 max-w-3xl mx-auto'>
              <div className='text-center mb-12'>
                <Title level={2} className='!text-3xl !font-bold !text-gray-900 !mb-4'>
                  Từ chủ đề đến infographic chỉ 10s
                </Title>
              </div>
              <div className='relative flex justify-center items-center min-h-[450px]'>
                {/* First image - bottom layer, slightly left */}
                <div className='absolute left-0 z-10 transition-all duration-500 hover:z-30 hover:scale-105'>
                  <img
                    src={imageSample1}
                    alt='Infographic Sample 1'
                    className='w-[280px] h-[450px] object-cover rounded-lg shadow-xl transform rotate-[-8deg] hover:rotate-[-2deg] transition-all duration-300'
                  />
                </div>

                {/* Second image - middle layer, center */}
                <div className='absolute left-1/2 transform -translate-x-1/2 z-20 transition-all duration-500 hover:z-30 hover:scale-105'>
                  <img
                    src={imageSample2}
                    alt='Infographic Sample 2'
                    className='w-[280px] h-[450px] object-cover rounded-lg shadow-xl transition-all duration-300'
                  />
                </div>

                {/* Third image - top layer, slightly right */}
                <div className='absolute right-0 z-30 transition-all duration-500 hover:scale-105'>
                  <img
                    src={imageSample3}
                    alt='Infographic Sample 3'
                    className='w-[280px] h-[450px] object-cover rounded-lg shadow-xl transform rotate-[8deg] hover:rotate-[2deg] transition-all duration-300'
                  />
                </div>
              </div>
            </section>

            {/* Popular Templates Section */}
            <section className='mt-20'>
              <div className='text-center mb-12'>
                <Title level={2} className='!text-3xl !font-bold !text-gray-900 !mb-4'>
                  Mẫu infographic phổ biến
                </Title>
                <Paragraph className='!text-gray-600 max-w-2xl mx-auto'>
                  Khởi đầu nhanh chóng với các mẫu được thiết kế chuyên nghiệp
                </Paragraph>
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card className='h-full border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:translate-y-[-5px]'>
                    <div className='text-center'>
                      <div className='bg-gray-800 h-32 rounded-lg mb-4 flex items-center justify-center'>
                        <div className='text-white'>
                          <div className='flex gap-2 mb-2'>
                            <div className='w-3 h-3 bg-orange-500 rounded-full'></div>
                            <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                          </div>
                          <div className='text-xs'>Business Analytics</div>
                        </div>
                      </div>
                      <Title level={4} className='!mb-2 !text-base !font-semibold'>
                        Thống kê kinh doanh
                      </Title>
                      <Paragraph className='!text-gray-600 !text-sm !mb-0'>Phù hợp cho báo cáo và phân tích</Paragraph>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                  <Card className='h-full border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:translate-y-[-5px]'>
                    <div className='text-center'>
                      <div className='bg-blue-900 h-32 rounded-lg mb-4 flex items-center justify-center'>
                        <div className='text-white'>
                          <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 bg-pink-500 rounded-full'></div>
                            <div className='w-4 h-[1px] bg-white'></div>
                            <div className='w-3 h-3 bg-blue-400 rounded-full'></div>
                            <div className='w-4 h-[1px] bg-white'></div>
                            <div className='w-3 h-3 bg-gray-400 rounded-full'></div>
                          </div>
                          <div className='text-xs mt-2'>Timeline</div>
                        </div>
                      </div>
                      <Title level={4} className='!mb-2 !text-base !font-semibold'>
                        Timeline dự án
                      </Title>
                      <Paragraph className='!text-gray-600 !text-sm !mb-0'>
                        Hiển thị các mốc thời gian quan trọng
                      </Paragraph>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                  <Card className='h-full border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:translate-y-[-5px]'>
                    <div className='text-center'>
                      <div className='bg-gradient-to-br from-blue-400 to-green-400 h-32 rounded-lg mb-4 flex items-center justify-center'>
                        <div className='text-white'>
                          <div className='grid grid-cols-2 gap-2'>
                            <div className='w-6 h-4 bg-blue-600 rounded'></div>
                            <div className='w-6 h-4 bg-green-500 rounded'></div>
                            <div className='w-6 h-4 bg-blue-500 rounded'></div>
                            <div className='w-6 h-4 bg-green-600 rounded'></div>
                          </div>
                          <div className='text-xs mt-2'>Compare</div>
                        </div>
                      </div>
                      <Title level={4} className='!mb-2 !text-base !font-semibold'>
                        So sánh sản phẩm
                      </Title>
                      <Paragraph className='!text-gray-600 !text-sm !mb-0'>So sánh tính năng và đặc điểm</Paragraph>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                  <Card className='h-full border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:translate-y-[-5px]'>
                    <div className='text-center'>
                      <div className='bg-gray-900 h-32 rounded-lg mb-4 flex items-center justify-center'>
                        <div className='text-white'>
                          <div className='flex flex-col items-center'>
                            <div className='w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-2 animate-spin'></div>
                            <div className='text-xs'>Process Flow</div>
                          </div>
                        </div>
                      </div>
                      <Title level={4} className='!mb-2 !text-base !font-semibold'>
                        Quy trình làm việc
                      </Title>
                      <Paragraph className='!text-gray-600 !text-sm !mb-0'>Mô tả các bước trong quy trình</Paragraph>
                    </div>
                  </Card>
                </Col>
              </Row>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
