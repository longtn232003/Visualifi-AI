import { ModalProps } from 'antd'

export interface ModalRef {
  stop: (data?: any) => void
  afterStopped: () => Promise<any>
}

export interface ModalSetting<Data = any> {
  modalId: number
  content: any
  option: Data
  modalRef?: ModalRef
}
export type ModalContent = React.ComponentType<any> | React.ReactNode

export interface ModalComponentProps<Data = any> {
  modalRef?: ModalRef
  data?: Data
}

type PropsFromComponent<TComponent> = TComponent extends React.FC<infer Props>
  ? Props
  : TComponent extends React.Component<infer Props>
  ? Props
  : any

type ModalDataFromProps<Props> = Props extends ModalComponentProps<infer ModalData> ? ModalData : any

export type ExtractModalData<T = any> = T extends (props: infer P) => any
  ? ModalDataFromProps<P>
  : ModalDataFromProps<PropsFromComponent<T>>

export interface BaseModalProps extends ModalProps {
  footer?:
    | React.ReactNode
    | ((
        originNode: React.ReactNode,
        extra: {
          OkBtn: React.FC
          CancelBtn: React.FC
        }
      ) => React.ReactNode)
  children: React.ReactNode
  width?: number
  styles?: ModalProps['styles']
  hideConfirmBtn?: boolean
  hideCancelBtn?: boolean
}
