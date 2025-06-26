import { Component } from 'react'
import Taro from '@tarojs/taro'
import { CoverView, CoverImage } from '@tarojs/components'
import './index.scss'

interface IState {
  selected: number
  color: string
  selectedColor: string
  list: Array<{
    pagePath: string
    text: string
    iconPath: string
    selectedIconPath: string
  }>
}

export default class Index extends Component<{}, IState> {
  state: IState = {
    selected: 0,
    color: '#6b7280',
    selectedColor: '#3b82f6',
    list: [
      {
        pagePath: '/pages/home/index',
        text: '首页',
        iconPath: '/assets/icons/home.png',
        selectedIconPath: '/assets/icons/home-active.png'
      },
      {
        pagePath: '/pages/tasks/index',
        text: '任务',
        iconPath: '/assets/icons/task.png',
        selectedIconPath: '/assets/icons/task-active.png'
      },
      {
        pagePath: '/pages/create/index',
        text: '',
        iconPath: '/assets/icons/add.png',
        selectedIconPath: '/assets/icons/add-active.png'
      },
      {
        pagePath: '/pages/messages/index',
        text: '消息',
        iconPath: '/assets/icons/message.png',
        selectedIconPath: '/assets/icons/message-active.png'
      },
      {
        pagePath: '/pages/profile/index',
        text: '我的',
        iconPath: '/assets/icons/user.png',
        selectedIconPath: '/assets/icons/user-active.png'
      }
    ]
  }

  componentDidMount() {
    // 获取当前页面路径并设置选中状态
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentPath = `/${currentPage.route}`

    const index = this.state.list.findIndex(item => currentPath.includes(item.pagePath))
    if (index !== -1) {
      this.setState({ selected: index })
    }
  }

  switchTab = (index: number, url: string) => {
    if (index === this.state.selected) return

    this.setState({ selected: index })
    Taro.switchTab({ url })
  }

  render() {
    const { list, selected, color, selectedColor } = this.state

    return (
      <CoverView className="custom-tab-bar">
        {list.map((item, index) => {
          const isSelected = selected === index
          const isCreateButton = index === 2

          return (
            <CoverView
              key={index}
              className={`tab-bar-item ${isCreateButton ? 'create-item' : ''}`}
              onClick={() => this.switchTab(index, item.pagePath)}
            >
              {isCreateButton ? (
                <CoverView className="create-button">
                  <CoverImage
                    className="create-icon"
                    src={isSelected ? item.selectedIconPath : item.iconPath}
                  />
                </CoverView>
              ) : (
                <>
                  <CoverImage
                    className="tab-bar-icon"
                    src={isSelected ? item.selectedIconPath : item.iconPath}
                  />
                  {item.text && (
                    <CoverView
                      className="tab-bar-text"
                      style={{ color: isSelected ? selectedColor : color }}
                    >
                      {item.text}
                    </CoverView>
                  )}
                </>
              )}
            </CoverView>
          )
        })}
      </CoverView>
    )
  }
}
