import { Header } from '@/components/layout/header'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { Footer } from '../footer'

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout className='min-h-screen flex flex-col'>
      <Header />
      <Layout className='flex-1'>
        <Content className=''>{children}</Content>
      </Layout>
      <Footer />
    </Layout>
  )
}
