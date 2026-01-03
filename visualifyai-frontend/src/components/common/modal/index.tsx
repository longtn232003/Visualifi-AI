import { useModalStore } from '@/stores/modal'
import React from 'react'

export const ModalContainer = () => {
  const { modals } = useModalStore()

  return (
    <>
      {modals.map(modal => {
        if (!modal.content) return null

        const ModalComponent = React.cloneElement(modal.content, {
          modalRef: modal.modalRef,
          data: modal.option
        })

        return <div key={modal.modalId}>{ModalComponent}</div>
      })}

      {/* other modal */}
    </>
  )
}
