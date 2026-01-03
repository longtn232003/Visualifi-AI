import { ModalContainer } from '@/components/common/modal'
import { Loading } from '@/components/common/loading'
import { RouterRenderer } from '@/router/router-renderer'
import { ToastContainer } from '@/components/common/toast'
import { AppProvider } from './components/layout/app-provider'

function App() {
  return (
    <AppProvider>
      <RouterRenderer />
      <Loading />
      <ModalContainer />
      <ToastContainer />
    </AppProvider>
  )
}

export default App
