import { IToast, showToast } from '@/components/common/toast'
import { useLoadingStore } from '@/stores/loading'
/**
 * add global helper variable
 */
const loadingStore = useLoadingStore.getState()

window.showLoading = () => loadingStore.showLoading()
window.hideLoading = () => loadingStore.hideLoading()
window.showToast = (props: IToast) => showToast(props)
