import { ModalConfirm } from '@/components/common/modal/modalConfirm'
import { LaunchModalParams, useModalStore } from '@/stores/modal'
import React, { ComponentType } from 'react'

type ModalParams<T extends ComponentType<any>> = Omit<LaunchModalParams<T>, 'type'>

interface ConfirmDialogOptions {
  title?: string
  message: string | React.ReactNode
  successMessage?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  type?: 'delete' | 'confirm'
}
// launchModal use for launch any modal
export const launchModal = <T extends ComponentType<any>>(params: ModalParams<T>) => {
  const modalStore = useModalStore.getState()
  return modalStore.launchModal(params)
}

// launchModalConfirm use for launch confirm modal
export const launchModalConfirm = async ({
  title = 'Confirm delete',
  message,
  onConfirm,
  onCancel,
  type = 'confirm'
}: ConfirmDialogOptions) => {
  const result = await launchModal({
    component: <ModalConfirm />,
    props: {
      title,
      component: typeof message === 'string' ? <p>{message}</p> : message,
      confirmType: type
    }
  }).afterStopped()

  if (result?.isConfirm) {
    await onConfirm?.()
  } else {
    onCancel?.()
  }
}
