import '@testing-library/jest-dom'

global.wx = {
  showToast: jest.fn(),
  showModal: jest.fn(),
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),
  reLaunch: jest.fn(),
  switchTab: jest.fn(),
  navigateBack: jest.fn()
} as unknown

Object.defineProperty(global, 'process', {
  value: {
    env: {
      TARO_ENV: 'weapp'
    }
  }
})