import { deleteInfographicMyStorage, getInfographicMyStorage, IInfographicSaved } from '@/apis/infographic/my-storage'
import { API_URL } from '@/constants/common'
import { IPaging } from '@/types/common'
import { launchModalConfirm } from '@/utils/modal'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Card, Col, Empty, Image, Pagination, Row, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

export const MyStorage = () => {
  const navigate = useNavigate()

  const [infographicMyStorage, setInfographicMyStorage] = useState<IInfographicSaved[]>([])
  const [paging, setPaging] = useState<IPaging>({
    page: 1,
    pageSize: 6,
    totalPage: 0,
    totalItem: 0
  })
  const [hoverKey, setHoverKey] = useState<number | null>(null)

  const fetchInfographicMyStorage = useCallback(
    async ({ page = paging.page, pageSize = paging.pageSize }: { page?: number; pageSize?: number }) => {
      try {
        showLoading()
        const res = await getInfographicMyStorage({ page, pageSize })
        setInfographicMyStorage(res.data.list)
        setPaging(res.data.meta)
        hideLoading()
      } catch (error) {
        hideLoading()
        console.log(error)
      }
    },
    [paging.page, paging.pageSize]
  )

  useEffect(() => {
    fetchInfographicMyStorage({})
  }, [fetchInfographicMyStorage])

  const StorageCard = ({ item }: { item: IInfographicSaved }) => (
    <Card className=' h-full border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer !p-2'>
      <div
        className={`relative h-50 overflow-hidden rounded-t-lg`}
        onMouseEnter={() => setHoverKey(item.id)}
        onMouseLeave={() => setHoverKey(null)}
      >
        <div className='h-full flex items-center justify-center'>
          <Image src={`${API_URL}/${item.imagePath}`} alt={''} className='w-full h-full object-cover' preview={false} />
          {hoverKey === item.id && (
            <div className='z-10 absolute right-0 top-0 bg-opacity-40 transition-opacity duration-300 flex items-end justify-end'>
              <div className='flex space-x-2 m-2'>
                <div
                  className='bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-all'
                  onClick={() => {
                    navigate(`/edit-infographic/${item.id}`)
                  }}
                >
                  <EditOutlined className='!text-white text-lg' />
                </div>
                <div
                  className='bg-red-500 hover:bg-red-600 p-2 rounded-full transition-all'
                  onClick={e => {
                    e.stopPropagation()
                    launchModalConfirm({
                      type: 'delete',
                      title: 'Xóa infographic',
                      message: 'Bạn chắc chắn muốn xoá infographic này khỏi kho lưu trữ?',
                      onConfirm: async () => {
                        try {
                          showLoading()
                          await deleteInfographicMyStorage(item.id)
                          fetchInfographicMyStorage({})
                          showToast({
                            message: 'Xóa infographic thành công'
                          })
                          hideLoading()
                        } catch {
                          hideLoading()
                        }
                      }
                    })
                  }}
                >
                  <DeleteOutlined className='!text-white text-lg' />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='p-4'>
        <Title level={4} className='!mb-2 !text-base !font-semibold'>
          {item.title}
        </Title>
        <Paragraph className='!text-gray-500 !text-sm !mb-1'>{item.savedAt}</Paragraph>
      </div>
    </Card>
  )

  return (
    <div className='infographic-my-storage'>
      {/* Grid Layout */}
      <Row gutter={[24, 24]} className='mb-8'>
        {paging.totalItem > 0 ? (
          infographicMyStorage.map(item => (
            <Col key={item.id} xs={24} sm={12} lg={8} xl={8}>
              <StorageCard item={item} />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Card className='h-full border border-gray-200 !p-18'>
              <Empty description='Không có dữ liệu' />
            </Card>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {paging.totalPage > 1 && (
        <div className='flex justify-center'>
          <Pagination
            current={paging.page}
            total={paging.totalItem}
            pageSize={paging.pageSize}
            onChange={page => {
              setPaging({ ...paging, page })
              fetchInfographicMyStorage({ page })
            }}
            showSizeChanger={false}
            showQuickJumper={false}
          />
        </div>
      )}
    </div>
  )
}
