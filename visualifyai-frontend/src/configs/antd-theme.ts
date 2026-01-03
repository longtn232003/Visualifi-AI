import { ThemeConfig } from 'antd'

export const antdThemeConfig: ThemeConfig = {
  token: {
    colorTextBase: 'var(--white)'
  },
  components: {
    Layout: {
      headerBg: 'var(--background-secondary)',
      headerHeight: 65,
      headerPadding: 0,
      footerBg: 'var(--background-secondary)'
    },
    Button: {
      colorPrimary: 'var(--color-primary)',
      colorPrimaryHover: 'var(--hover-primary)',
      colorPrimaryActive: 'var(--hover-primary)',
      primaryShadow: 'var(--shadow-primary)',
      colorBgContainerDisabled: 'red'
    },
    Input: {
      colorPrimary: 'var(--color-primary)',
      colorPrimaryHover: 'var(--color-primary)',
      colorPrimaryActive: 'var(--color-primary)'
    },
    Checkbox: {
      colorPrimary: 'var(--color-primary)',
      colorPrimaryHover: 'var(--color-primary)',
      colorPrimaryActive: 'var(--color-primary)'
    },
    Select: {
      colorPrimary: 'var(--color-primary)',
      colorPrimaryHover: 'var(--color-primary)',
      colorPrimaryActive: 'var(--color-primary)'
    }
  }
}
