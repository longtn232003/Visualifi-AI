interface IProps {
  path?: string
  firstLetter: string
  className?: string
}

export const AvatarBase = ({ path, firstLetter, className }: IProps) => {
  return path ? (
    <img
      src={path}
      alt='avatar'
      className={`w-10 h-10 rounded-full ${className}`}
      onError={e => {
        const parent = e.currentTarget.parentElement
        if (parent) {
          e.currentTarget.remove()
          const div = document.createElement('div')
          div.className = `w-full h-full flex items-center justify-center text-white font-medium hover:bg-gray-100 ${className}`
          div.textContent = firstLetter.toUpperCase()
          parent.appendChild(div)
        }
      }}
    />
  ) : (
    <div
      className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 ${className} hover:bg-gray-100`}
    >
      {firstLetter.toUpperCase()}
    </div>
  )
}
