/* eslint-disable no-var */
import { IToast } from '@/components/common/toast'
import { ShowLoadingProps } from '@/stores/loadingStore'
/**
 * add global types
 */
declare global {
  declare var showLoading: (props?: ShowLoadingProps) => void
  declare var hideLoading: () => void
  declare var showToast: (props: IToast) => void
}
