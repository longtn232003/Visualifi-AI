import { Avatar, Button, Card, Image, List, Space, Typography } from 'antd'
import { API_URL } from '@/constants/common'
import { Bot, Download, Edit, MoreVertical, Store, User } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from '../..'

const { Text } = Typography

interface ChatHistoryProps {
  messages: ChatMessage[]
  onEditInfographic?: (imageId?: number) => void
  onSaveToLibrary?: (id: number) => void
  onDownload?: (id: number) => void
}

export const ChatHistory = ({ messages, onEditInfographic, onSaveToLibrary, onDownload }: ChatHistoryProps) => {
  const [activeImageActions, setActiveImageActions] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleImageActions = (index: number) => {
    setActiveImageActions(prev => (prev === index ? null : index))
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setActiveImageActions(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <Card className='shadow-lg border-none !p-6 mb-6'>
      <List
        itemLayout='horizontal'
        dataSource={messages}
        className='space-y-6'
        renderItem={(message, index) => (
          <List.Item className={`flex items-start gap-4 !border-0 !p-0`}>
            <Avatar
              icon={message.type === 'user' ? <User size={18} /> : <Bot size={18} />}
              className={message.type === 'user' ? 'bg-blue-500' : 'bg-purple-600'}
            />
            <div className='flex-1'>
              <Space direction='vertical' size={12} className='w-full'>
                {message.content && (
                  <div
                    className={`rounded-lg p-2 ${
                      message.type === 'user'
                        ? 'bg-gray-50 border border-gray-100'
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <Text className='text-gray-700'>{message.content}</Text>
                  </div>
                )}
                {message.image && (
                  <div className='relative mt-2 overflow-hidden rounded-lg shadow-md border border-gray-200 group flex justify-center items-center'>
                    <Image
                      src={`${API_URL}/${message.image}`}
                      alt='Generated Infographic'
                      className='w-full max-h-[450px] object-contain'
                      preview={false}
                    />

                    {/* Action Button */}
                    <div className='absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button
                        type='primary'
                        shape='circle'
                        icon={<MoreVertical size={16} />}
                        className='!flex !items-center !justify-center !bg-gray-800 !border-0'
                        onClick={() => toggleImageActions(index)}
                        ref={buttonRef}
                      />
                    </div>

                    {/* Action Menu */}
                    {activeImageActions === index && (
                      <div
                        ref={menuRef}
                        className='absolute top-12 right-2 z-20 bg-white rounded-md shadow-lg p-2 min-w-[180px]'
                      >
                        <div className='space-y-2 max-w-[180px]'>
                          <Button
                            icon={<Edit size={16} />}
                            type='primary'
                            className='w-full'
                            onClick={() => {
                              if (onEditInfographic && message.id) {
                                onEditInfographic(message.id)
                              }
                              setActiveImageActions(null)
                            }}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            icon={<Store size={16} />}
                            className='w-full !bg-[var(--secondary)] !text-white hover:!bg-[var(--hover-secondary)]'
                            onClick={() => {
                              console.log('message', message)
                              if (onSaveToLibrary && message.id) {
                                onSaveToLibrary(message.id)
                              }
                              setActiveImageActions(null)
                            }}
                          >
                            Lưu vào kho ảnh
                          </Button>
                          <Button
                            icon={<Download size={16} />}
                            className='w-full'
                            onClick={() => {
                              if (onDownload && message.id) {
                                onDownload(message.id)
                              }
                              setActiveImageActions(null)
                            }}
                          >
                            Tải xuống
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}
