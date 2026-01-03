import { ExtractModalData, ModalRef, ModalSetting } from '@/components/common/modal/modal.type'
import { isCustomComponent } from '@/utils/react-element'
import React, { ComponentType } from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type LaunchModalParams<T extends ComponentType<any>> = {
  component: T | React.ReactElement<any>
  props?: ExtractModalData<T>
  type?: 'default' | 'confirm'
  reset?: boolean
}

export interface ModalStore {
  modals: ModalSetting[]
  modalId: number
  launchModal: <T extends ComponentType<any>>(params: LaunchModalParams<T>) => ModalRef
  stopModal: (modalId: number, data?: any) => void
}

const initialState = {
  modals: [],
  modalId: 1
}

export const useModalStore = create<ModalStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      launchModal: ({ component, props: option, reset }) => {
        const { modalId, stopModal } = get()
        const callbacks: ((data: unknown) => void)[] = []

        const modalRef: ModalRef = {
          stop: (data: unknown) => {
            callbacks.forEach(callback => callback(data))
            stopModal(modalId, data)
          },
          afterStopped: () => {
            return new Promise(resolve => {
              callbacks.push(resolve)
            })
          }
        }

        const isCustomComp = isCustomComponent(component)

        if (!isCustomComp) {
          throw new Error('Prop component must be a custom component')
        }

        set(
          state => ({
            modals: [
              ...(reset ? [] : state.modals),
              {
                content: component,
                option: option || {},
                modalRef,
                modalId
              }
            ],
            modalId: state.modalId + 1
          }),
          false,
          'launchModal'
        )
        return modalRef
      },

      stopModal: modalId => {
        set(
          state => {
            const newModals = state.modals.filter(modal => modal.modalId !== modalId)

            return { modals: newModals }
          },
          false,
          'stopModal'
        )
      }
    }),
    {
      name: 'Modal Store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)
