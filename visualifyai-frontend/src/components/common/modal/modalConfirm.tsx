import { BaseModal } from '@/components/common/modal/baseModal'
import { ModalComponentProps } from '@/components/common/modal/modal.type'
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import React, { createElement } from 'react'
interface PropsData {
  title?: string
  component?: React.ReactNode
  confirmType?: 'delete' | 'confirm'
}

export const ModalConfirm = ({ modalRef, data }: ModalComponentProps<PropsData>) => {
  const Title = () => (
    <>
      <span className='mr-2'>
        {data?.confirmType === 'delete' ? (
          <ExclamationCircleOutlined className='!text-red-500' />
        ) : (
          <CheckCircleOutlined className='!text-green-500' />
        )}
      </span>
      <span className='font-bold text'>{data?.title || 'Confirm delete'}</span>
    </>
  )

  let ContentComponent: React.ReactNode | null = null
  if (data?.component && React.isValidElement(data.component)) {
    ContentComponent = React.cloneElement(data.component)
  } else if (data?.component && typeof data.component === 'function') {
    ContentComponent = createElement(data.component)
  }

  return (
    <BaseModal
      width={480}
      title={<Title />}
      onCancel={() => modalRef?.stop()}
      onOk={() => modalRef?.stop({ isConfirm: true })}
    >
      <div className='p-2 text-lg !text-[15px]'>{ContentComponent ? ContentComponent : 'No content available'}</div>
    </BaseModal>
  )
}
