import { saveInfographicApi } from '@/apis/infographic/save-infographic'
import { BaseModal } from '@/components/common/modal/baseModal'
import { ModalComponentProps } from '@/components/common/modal/modal.type'
import { Form, Input } from 'antd'

export const ModalSaveInfographic = ({ modalRef, data }: ModalComponentProps<{ id: number }>) => {
  const [form] = Form.useForm()

  const handleSaveInfographic = async (values: { title: string; description: string }) => {
    if (!data) return
    try {
      showLoading()
      await saveInfographicApi({
        infographicId: data.id,
        title: values.title,
        description: values.description
      })
      hideLoading()
      modalRef?.stop()
      showToast({
        message: 'Lưu infographic vào kho thành công'
      })
    } catch {
      hideLoading()
    }
  }

  return (
    <BaseModal title='Lưu infographic vào kho' onCancel={() => modalRef?.stop()} onOk={() => form.submit()} width={500}>
      <Form form={form} onFinish={handleSaveInfographic} className='!mt-8' layout='vertical'>
        <Form.Item label='Tiêu đề' name='title' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Mô tả' name='description'>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </BaseModal>
  )
}
