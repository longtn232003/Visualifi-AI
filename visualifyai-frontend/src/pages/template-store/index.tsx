import { getCategories, ICategories } from '@/apis/template-infographic/categories'
import { getListTemplateInfographic, ITemplateInfographic } from '@/apis/template-infographic/get-list'
import { LoginModal } from '@/components/features/login'
import { API_URL } from '@/constants/common'
import { useAuthStore } from '@/stores/auth'
import { IPaging } from '@/types/common'
import { launchModal } from '@/utils/modal'
import { Button, Card, Col, Empty, Image, Input, Pagination, Row, Select, Typography } from 'antd'
import { debounce } from 'lodash-es'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const TemplateCard = ({ template, onUseTemplate }: { template: ITemplateInfographic; onUseTemplate: () => void }) => (
  <Card
    className='h-full border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group'
    onClick={onUseTemplate}
  >
    <div className={`relative overflow-hidden rounded-t-lg`}>
      <div className='h-full flex items-center justify-center'>
        <Image
          src={`${API_URL}/${template.imagePath}`}
          alt={template.title}
          preview={false}
          className='w-full object-cover !h-48'
        />
      </div>

      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
        <Button type='primary' className='btn-base-secondary'>
          Sử dụng mẫu
        </Button>
      </div>
    </div>

    <div className='p-2'>
      <Title level={4} className='!mb-2 !text-base !font-semibold !line-clamp-1'>
        {template.title}
      </Title>
      <Paragraph className='!text-gray-600 !text-sm !mb-3 !leading-relaxed min-h-[46px] !line-clamp-2'>
        {template.description}
      </Paragraph>

      <div className='flex gap-1'>
        <span className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700`}>{template.category}</span>
      </div>
    </div>
  </Card>
)

export default function TemplateStorePage() {
  const navigate = useNavigate()
  const { user, accessToken } = useAuthStore()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<ICategories[]>([])
  const [paging, setPaging] = useState<IPaging>({
    page: 1,
    pageSize: 8,
    totalItem: 0,
    totalPage: 0
  })
  const [templates, setTemplates] = useState<ITemplateInfographic[]>([])

  const fetchCategories = async () => {
    try {
      showLoading()
      const res = await getCategories()
      setCategories(res.data)
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const fetchInfographicTemplates = async ({
    page = paging.page,
    pageSize = paging.pageSize,
    category = selectedCategory,
    search = searchTerm.trim()
  }: {
    page?: number
    pageSize?: number
    category?: string
    search?: string
  }) => {
    try {
      showLoading()
      const res = await getListTemplateInfographic({ page, pageSize, category, search })
      setTemplates(res.data.list)
      setPaging(res.data.meta)
      hideLoading()
    } catch {
      hideLoading()
    }
  }

  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue: string) => {
        fetchInfographicTemplates({
          search: searchValue.trim(),
          page: 1
        })
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleUseTemplate = (templateId: number) => {
    if (!accessToken || !user) {
      showToast({
        message: 'Vui lòng đăng nhập để sử dụng mẫu',
        type: 'warning'
      })

      launchModal({
        component: <LoginModal />
      })

      return
    }

    navigate(`/edit-infographic/${templateId}?previousScreen=template-store`)
  }

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchCategories()
    fetchInfographicTemplates({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='min-h-screen bg-[#f8f9ff] py-14 template-infographic-page'>
      <div className='max-w-7xl mx-auto px-4 '>
        {/* Header */}
        <div className='text-center mb-8'>
          <Title level={1} className='!text-4xl !font-bold !text-gray-900 !mb-4'>
            Mẫu Infographic
          </Title>
        </div>
        {paging.totalItem > 0 ? (
          <>
            {/* Search and Filter Bar */}
            <div className='mb-8'>
              <Row gutter={[16, 16]} align='middle'>
                <Col xs={24} sm={12} md={8}>
                  <Input
                    size='large'
                    placeholder='Tìm mẫu'
                    prefix={<Search size={16} className='text-gray-400' />}
                    value={searchTerm}
                    onChange={e => {
                      const value = e.target.value
                      setSearchTerm(value)
                      debouncedSearch(value)
                    }}
                    className='!h-10'
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Select
                    size='large'
                    className='!w-full !h-10'
                    placeholder='Chọn danh mục'
                    options={[
                      { label: 'Tất cả', value: '' },
                      ...categories.map(category => ({ label: category.name, value: category.name }))
                    ]}
                    onChange={value => {
                      setSelectedCategory(value)
                      fetchInfographicTemplates({ category: value, page: 1 })
                    }}
                  />
                </Col>
              </Row>
            </div>

            {/* Templates Grid */}
            <Row gutter={[24, 24]}>
              {templates.map(template => (
                <Col key={template.id} xs={24} sm={12} lg={8} xl={6}>
                  <TemplateCard
                    template={template}
                    onUseTemplate={() => {
                      handleUseTemplate(template.id)
                    }}
                  />
                </Col>
              ))}
            </Row>

            {paging.totalPage > 1 && (
              <div className='flex justify-center mt-16'>
                <Pagination
                  current={paging.page}
                  total={paging.totalItem}
                  pageSize={paging.pageSize}
                  onChange={page => {
                    setPaging({ ...paging, page })
                    fetchInfographicTemplates({ page })
                  }}
                  showSizeChanger={false}
                  showQuickJumper={false}
                />
              </div>
            )}
          </>
        ) : (
          <div className='flex justify-center items-center h-full mt-24'>
            <Empty description='Không có dữ liệu' />
          </div>
        )}
      </div>
    </div>
  )
}
