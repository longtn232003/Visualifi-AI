import { generateImageApi, IGenerateImageResponse } from '@/apis/infographic/generate-image'
import { useState } from 'react'
import { GenInfographic } from './components/gen-infographic'
import { FormPromptTab, FormPromptValues } from './components/form-prompt'
import { useAuthStore } from '@/stores/auth'
import { launchModal } from '@/utils/modal'
import { LoginModal } from '@/components/features/login'
import { ModalSaveInfographic } from './components/modal-save-infographic'
import { useNavigate } from 'react-router-dom'

export interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  image: string | null
  id: number | null
}

export default function CreateInfographicPage() {
  const { user, accessToken } = useAuthStore()
  const navigate = useNavigate()

  const [imageGenerated, setImageGenerated] = useState<IGenerateImageResponse | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleCreateInfographic = async (values: FormPromptValues, activeTab: FormPromptTab) => {
    const isLoggedIn = !!user && !!accessToken

    if (!isLoggedIn) {
      showToast({
        message: 'Vui lòng đăng nhập để tạo infographic',
        type: 'warning'
      })

      launchModal({
        component: <LoginModal />,
        props: {
          previousPath: window.location.pathname
        }
      })

      return
    }

    if (!values.prompt) {
      showToast({
        message:
          activeTab === FormPromptTab.TOPIC ? 'Nhập nội dung bạn muốn tạo infographic' : 'Vui lòng tải lên tập tin',
        type: 'warning'
      })

      return
    }

    const userMessage: ChatMessage = {
      type: 'user',
      content: values.prompt,
      image: null,
      id: null
    }

    try {
      showLoading()
      const res = await generateImageApi({ prompt: values.prompt, size: values.format })

      setImageGenerated(res.data)

      const assistantMessage: ChatMessage = {
        type: 'assistant',
        content: '',
        image: res.data.imagePath,
        id: res.data.id
      }
      setMessages(prev => [userMessage, assistantMessage, ...prev])
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const handleSaveToLibrary = (id: number) => {
    console.log('id', id)
    if (!id) {
      showToast({
        message: 'Vui lòng tạo infographic trước khi lưu vào kho ảnh',
        type: 'error'
      })

      return
    }

    launchModal({
      component: <ModalSaveInfographic />,
      props: {
        id
      }
    })
  }

  const handleEditInfographic = (imageId?: number) => {
    const idToEdit = imageId || imageGenerated?.id

    if (idToEdit) {
      navigate(`/edit-infographic/${idToEdit}`)
    } else {
      showToast({
        message: 'Có lỗi khi sửa infographic',
        type: 'error'
      })
    }
  }

  return (
    <GenInfographic
      image={imageGenerated?.imagePath}
      onEditInfographic={handleEditInfographic}
      onGenerateInfographic={handleCreateInfographic}
      onSaveToLibrary={handleSaveToLibrary}
      messages={messages}
    />
  )
}
