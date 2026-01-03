import { useLoadingStore } from '@/stores/loading'
import { PulseLoader } from 'react-spinners'

interface ILoadingProps {
  show?: boolean
}
export const Loading = ({ show }: ILoadingProps) => {
  const { loading, onlyOverlay } = useLoadingStore()

  return loading || show ? (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-[9999] ${
        onlyOverlay ? 'bg-black/10' : 'bg-black/30'
      } z-[9999] backdrop-blur-[1px]`}
    >
      {!onlyOverlay && <PulseLoader color='var(--secondary)' size={15} speedMultiplier={0.8} />}
    </div>
  ) : null
}
