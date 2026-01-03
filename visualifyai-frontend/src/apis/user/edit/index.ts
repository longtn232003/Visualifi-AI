import { IUser } from '@/types/user'
import { requestApi } from '@/services/api-service'

type IUpdateProfile = Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'password' | 'planType' | 'avatarUrl'>>

export const updateProfile = async (data: IUpdateProfile) => {
  const formData = new FormData()

  Object.keys(data).forEach(key => {
    const keyAllowEmpty = ['address', 'phoneNumber']
    if (!data[key] && !keyAllowEmpty.includes(key)) return

    if (key === 'avatarUrl') {
      formData.append('avatar', data[key])
    } else {
      formData.append(key, data[key])
    }
  })

  return requestApi(
    {
      path: '/user/update',
      method: 'PUT',
      body: formData
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
