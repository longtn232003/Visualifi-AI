import { InfographicSize, InfographicStyle } from '@/types/infographic'
import { BaseOptionType } from 'antd/es/select'

export const infographicStyleOptions: BaseOptionType[] = [
  {
    value: InfographicStyle.SIMPLE,
    label: 'Tối giản'
  },
  {
    value: InfographicStyle.MODERN,
    label: 'Hiện đại'
  },
  {
    value: InfographicStyle.CLASSIC,
    label: 'Cổ điển'
  },
  {
    value: InfographicStyle.MINIMALIST,
    label: 'Đậm nét'
  },
  {
    value: InfographicStyle.ARTISTIC,
    label: 'Nghệ thuật'
  }
]

export const infographicFormatOptions: BaseOptionType[] = [
  {
    value: InfographicSize.SIZE_11,
    label: '1:1'
  },
  {
    value: InfographicSize.SIZE_23,
    label: '2:3'
  },
  {
    value: InfographicSize.SIZE_32,
    label: '3:2'
  }
]
