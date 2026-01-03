import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('vi')

type TDate = Date | Dayjs | string

export const DDMMYYYYHHmmss = (date: TDate, separator = '-') => {
  return dayjs(date).format(`DD${separator}MM${separator}YYYY HH:mm:ss`)
}

export const YYYYMMDDHHmmss = (date: TDate, separator = '-') => {
  return dayjs(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`)
}

export const YYYYMMDD = (date: TDate, separator = '-') => {
  return dayjs(date).format(`YYYY${separator}MM${separator}DD`)
}

export const DDMMYYYY = (date: TDate, separator = '-') => {
  return dayjs(date).format(`DD${separator}MM${separator}YYYY`)
}

export const getRelativeTime = (date: TDate, locale: 'en' | 'vi' = 'vi') => {
  return dayjs().locale(locale).to(dayjs(date))
}

export const getDiffForHumans = (date: TDate) => {
  return dayjs(date).fromNow()
}
