import { useState, useRef, useEffect, useCallback } from 'react'
import { Button, Typography, Input, Select, ColorPicker, Slider } from 'antd'
import { Download, Store, Type } from 'lucide-react'
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer } from 'react-konva'
import useImage from 'use-image'
import { API_URL } from '@/constants/common'
import { useLocation, useParams } from 'react-router-dom'
import { getInfographicDetailApi, IInfographicDetail } from '@/apis/infographic/get-detail'
import { getTemplateInfographicDetailApi, ITemplateInfographicDetail } from '@/apis/template-infographic/get-detail'

const { Title, Text } = Typography
const { TextArea } = Input

interface TextElement {
  id: string
  x: number
  y: number
  text: string
  fontSize: number
  fontFamily: string
  fill: string
  width: number
}

const DEFAULT_TEXT: Omit<TextElement, 'id'> = {
  x: 50,
  y: 50,
  text: 'Nhấp để chỉnh sửa',
  fontSize: 24,
  fontFamily: 'Arial',
  fill: '#000000',
  width: 200
}

const FONT_OPTIONS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' }
]

// Background Image Component
const BackgroundImage = ({
  src,
  width,
  height,
  onLoad
}: {
  src: string
  width: number
  height: number
  onLoad?: (img: HTMLImageElement) => void
}) => {
  const [image] = useImage(src)

  useEffect(() => {
    if (image && onLoad) {
      onLoad(image)
    }
  }, [image, onLoad])

  return image ? <KonvaImage image={image} width={width} height={height} listening={false} /> : null
}

// Custom Hooks
const useStageSize = (infographicData?: string) => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })

  const calculateStageSize = useCallback((img: HTMLImageElement) => {
    const container = document.querySelector('.canvas-container')
    const containerRect = container?.getBoundingClientRect()

    const maxWidth = containerRect ? containerRect.width - 100 : 1200
    const maxHeight = containerRect ? containerRect.height - 100 : 800

    let { width, height } = img

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width *= ratio
      height *= ratio
    }

    setStageSize({ width, height })
  }, [])

  // Auto-resize on window resize
  useEffect(() => {
    if (!infographicData) return

    const handleResize = () => {
      const img = new Image()
      img.onload = () => calculateStageSize(img)
      img.src = `data:image/png;base64,${infographicData}`
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [infographicData, calculateStageSize])

  return { stageSize, calculateStageSize }
}

const useTextElements = () => {
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)

  const addText = useCallback(() => {
    const newText: TextElement = {
      ...DEFAULT_TEXT,
      id: `text-${Date.now()}`
    }
    setTextElements(prev => [...prev, newText])
    setSelectedTextId(newText.id)
  }, [])

  const updateText = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => {
      const element = prev.find(el => el.id === id)
      if (!element) return prev

      const hasChanges = Object.keys(updates).some(key => {
        const updateKey = key as keyof TextElement
        return element[updateKey] !== updates[updateKey]
      })

      return hasChanges ? prev.map(el => (el.id === id ? { ...el, ...updates } : el)) : prev
    })
  }, [])

  const deleteText = useCallback((id: string) => {
    setTextElements(prev => prev.filter(el => el.id !== id))
    setSelectedTextId(prev => (prev === id ? null : prev))
  }, [])

  const selectedText = textElements.find(el => el.id === selectedTextId) || null

  return {
    textElements,
    selectedTextId,
    selectedText,
    setSelectedTextId,
    addText,
    updateText,
    deleteText
  }
}

const useInlineEditor = (
  textElements: TextElement[],
  updateText: (id: string, updates: Partial<TextElement>) => void
) => {
  const [isEditing, setIsEditing] = useState(false)
  const stageRef = useRef<any>(null)

  const startEditing = useCallback(
    (textId: string) => {
      const textElement = textElements.find(el => el.id === textId)
      if (!textElement || !stageRef.current) return

      setIsEditing(true)
      const stage = stageRef.current
      const textNode = stage.findOne(`#${textId}`)
      if (!textNode) return

      textNode.hide()

      const textPosition = textNode.absolutePosition()
      const stageBox = stage.container().getBoundingClientRect()

      const textarea = document.createElement('textarea')
      Object.assign(textarea.style, {
        position: 'absolute',
        top: `${stageBox.top + textPosition.y}px`,
        left: `${stageBox.left + textPosition.x}px`,
        width: `${textElement.width}px`,
        fontSize: `${textElement.fontSize}px`,
        fontFamily: textElement.fontFamily,
        color: textElement.fill,
        border: '2px solid #0066ff',
        padding: '4px',
        margin: '0',
        overflow: 'hidden',
        background: 'white',
        outline: 'none',
        resize: 'none',
        zIndex: '1000'
      })

      textarea.value = textElement.text
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()

      const cleanup = () => {
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea)
        }
        textNode.show()
        setIsEditing(false)
      }

      const autoResize = () => {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }

      textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          updateText(textId, { text: textarea.value })
          cleanup()
        } else if (e.key === 'Escape') {
          cleanup()
        }
      })

      textarea.addEventListener('blur', () => {
        updateText(textId, { text: textarea.value })
        cleanup()
      })

      textarea.addEventListener('input', autoResize)
      autoResize()
    },
    [textElements, updateText]
  )

  return { isEditing, setIsEditing, startEditing, stageRef }
}

const useTransformer = (selectedTextId: string | null, isEditing: boolean) => {
  const transformerRef = useRef<any>(null)

  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return

    if (selectedTextId && !isEditing) {
      const stage = transformer.getStage()
      const selectedNode = stage?.findOne(`#${selectedTextId}`)
      if (selectedNode) {
        transformer.nodes([selectedNode])
        transformer.getLayer().batchDraw()
      }
    } else {
      transformer.nodes([])
      transformer.getLayer().batchDraw()
    }
  }, [selectedTextId, isEditing])

  return transformerRef
}

const EditInfographic = () => {
  const { id } = useParams()

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const previousScreen = queryParams.get('previousScreen')

  const { textElements, selectedTextId, selectedText, setSelectedTextId, addText, updateText, deleteText } =
    useTextElements()
  const { isEditing, setIsEditing, startEditing, stageRef } = useInlineEditor(textElements, updateText)
  const transformerRef = useTransformer(selectedTextId, isEditing)

  const [infographicDetail, setInfographicDetail] = useState<IInfographicDetail | null>(null)
  const [templateInfographicDetail, setTemplateInfographicDetail] = useState<ITemplateInfographicDetail | null>(null)
  const imagePath = infographicDetail?.imagePath || templateInfographicDetail?.imagePath

  const { stageSize, calculateStageSize } = useStageSize(imagePath)

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedTextId(null)
      setIsEditing(false)
    }
  }

  const handleTransformEnd = (textId: string, e: any) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    if (Math.abs(scaleX - 1) > 0.1 || Math.abs(scaleY - 1) > 0.1) {
      node.scaleX(1)
      node.scaleY(1)

      const textElement = textElements.find(el => el.id === textId)
      if (textElement) {
        updateText(textId, {
          fontSize: Math.max(12, Math.round(textElement.fontSize * Math.max(scaleX, scaleY))),
          width: Math.max(50, Math.round(textElement.width * scaleX))
        })
      }
    }
  }

  const getInfographicDetail = async () => {
    try {
      showLoading()
      const res = await getInfographicDetailApi(Number(id))
      setInfographicDetail(res.data)
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const getTemplateInfographicDetail = async () => {
    try {
      showLoading()
      const res = await getTemplateInfographicDetailApi(Number(id))
      setTemplateInfographicDetail(res.data)
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  useEffect(() => {
    if (!id) return

    if (previousScreen === 'template-store') {
      getTemplateInfographicDetail()
    } else {
      getInfographicDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, previousScreen])

  return (
    <div className='h-screen bg-gray-50 flex flex-col edit-infographic-page'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between'>
        <Title level={4} className='!mb-0'>
          Chỉnh sửa Text Infographic
        </Title>
        <div className='flex items-center space-x-3'>
          <Button
            type='primary'
            icon={<Store size={16} />}
            className='flex items-center gap-2 !bg-[var(--secondary)] hover:!bg-[var(--hover-secondary)]'
          >
            Thêm vào kho lưu trữ
          </Button>
          <Button className='flex items-center gap-2' icon={<Download size={16} />}>
            Tải xuống
          </Button>
        </div>
      </header>

      <div className='flex-1 flex'>
        {/* Sidebar */}
        <aside className='w-80 bg-white border-r border-gray-200 flex flex-col'>
          <div className='p-4 border-b border-gray-200'>
            <Text className='text-sm font-medium text-gray-600'>Công cụ Text</Text>
          </div>

          <div className='p-4 space-y-4'>
            <Button block icon={<Type size={16} />} onClick={addText} type='primary'>
              Thêm Text
            </Button>

            {/* Text List */}
            <div className='space-y-2'>
              <Text className='text-sm font-medium'>Danh sách Text ({textElements.length}):</Text>
              {textElements.length === 0 ? (
                <div className='text-center py-4 text-gray-500'>
                  <Type size={32} className='mx-auto mb-2 text-gray-300' />
                  <Text className='text-xs'>Chưa có text nào</Text>
                  <Text className='text-xs'>Nhấn "Thêm Text" để bắt đầu</Text>
                </div>
              ) : (
                textElements.map(textEl => (
                  <div
                    key={textEl.id}
                    className={`p-2 border rounded cursor-pointer text-element-item ${
                      selectedTextId === textEl.id ? 'selected' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTextId(textEl.id)}
                    onDoubleClick={() => startEditing(textEl.id)}
                  >
                    <div className='flex justify-between items-center'>
                      <div className='flex-1 min-w-0'>
                        <Text className='text-xs truncate block'>{textEl.text || 'Text trống'}</Text>
                        <Text className='text-xs text-gray-400'>
                          {textEl.fontSize}px • {textEl.fontFamily}
                        </Text>
                      </div>
                      <Button
                        size='small'
                        danger
                        type='text'
                        onClick={e => {
                          e.stopPropagation()
                          deleteText(textEl.id)
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {textElements.length > 0 && (
              <div className='mt-4 p-2 bg-blue-50 rounded text-xs text-blue-600'>
                💡 Mẹo: Double-click vào text để chỉnh sửa trực tiếp
              </div>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <main className='flex-1 flex flex-col'>
          <div className='flex-1 canvas-container'>
            <div className='canvas-wrapper'>
              <div className='bg-white p-2 rounded-lg shadow-lg'>
                <Stage width={stageSize.width} height={stageSize.height} ref={stageRef} onClick={handleStageClick}>
                  <Layer>
                    {!!imagePath && (
                      <BackgroundImage
                        src={`${API_URL}/${imagePath}`}
                        width={stageSize.width}
                        height={stageSize.height}
                        onLoad={calculateStageSize}
                      />
                    )}

                    {textElements.map(textEl => (
                      <KonvaText
                        key={textEl.id}
                        id={textEl.id}
                        x={textEl.x}
                        y={textEl.y}
                        text={textEl.text}
                        fontSize={textEl.fontSize}
                        fontFamily={textEl.fontFamily}
                        fill={textEl.fill}
                        width={textEl.width}
                        draggable={!isEditing}
                        onClick={() => setSelectedTextId(textEl.id)}
                        onDblClick={() => startEditing(textEl.id)}
                        onDragEnd={e => updateText(textEl.id, { x: e.target.x(), y: e.target.y() })}
                        onTransformEnd={e => handleTransformEnd(textEl.id, e)}
                        visible={!isEditing || selectedTextId !== textEl.id}
                      />
                    ))}

                    {selectedTextId && !isEditing && (
                      <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                          return newBox.width < 50 || newBox.height < 20 ? oldBox : newBox
                        }}
                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                        rotateEnabled={false}
                      />
                    )}
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
        </main>

        {/* Properties Panel */}
        <aside className='w-80 bg-white border-l border-gray-200'>
          <div className='p-4 border-b border-gray-200'>
            <Text className='text-sm font-medium text-gray-600'>Thuộc tính Text</Text>
          </div>

          <div className='p-4 space-y-6 properties-panel'>
            {selectedText ? (
              <>
                <div>
                  <Text className='text-sm font-medium mb-2 block'>Nội dung</Text>
                  <TextArea
                    value={selectedText.text}
                    onChange={e => updateText(selectedText.id, { text: e.target.value })}
                    rows={3}
                    placeholder='Nhập nội dung text...'
                  />
                </div>

                <div>
                  <Text className='text-sm font-medium mb-2 block'>Màu chữ</Text>
                  <ColorPicker
                    value={selectedText.fill}
                    onChange={color => updateText(selectedText.id, { fill: color.toHexString() })}
                    size='small'
                  />
                </div>

                <div>
                  <Text className='text-sm font-medium mb-2 block'>Kích thước chữ</Text>
                  <Slider
                    value={selectedText.fontSize}
                    onChange={value => updateText(selectedText.id, { fontSize: value })}
                    min={12}
                    max={72}
                  />
                  <Text className='text-xs text-gray-500'>{selectedText.fontSize}px</Text>
                </div>

                <div>
                  <Text className='text-sm font-medium mb-2 block'>Font chữ</Text>
                  <Select
                    value={selectedText.fontFamily}
                    onChange={value => updateText(selectedText.id, { fontFamily: value })}
                    className='w-full'
                    options={FONT_OPTIONS}
                  />
                </div>

                <div>
                  <Text className='text-sm font-medium mb-2 block'>Độ rộng</Text>
                  <Slider
                    value={selectedText.width}
                    onChange={value => updateText(selectedText.id, { width: value })}
                    min={50}
                    max={500}
                  />
                  <Text className='text-xs text-gray-500'>{selectedText.width}px</Text>
                </div>
              </>
            ) : (
              <div className='text-center text-gray-500 py-8'>
                <Type size={48} className='mx-auto mb-4 text-gray-300' />
                <Text>Chọn một text để chỉnh sửa thuộc tính</Text>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default EditInfographic
