Component({
  data: {
    selected: 0,
    color: "#6b7280",
    selectedColor: "#3b82f6",
    list: [{
      pagePath: "/pages/home/index",
      iconPath: "/assets/icons/home.png",
      selectedIconPath: "/assets/icons/home-active.png",
      text: "首页"
    }, {
      pagePath: "/pages/tasks/index",
      iconPath: "/assets/icons/task.png",
      selectedIconPath: "/assets/icons/task-active.png",
      text: "任务"
    }, {
      pagePath: "/pages/create/index",
      iconPath: "/assets/icons/add.png",
      selectedIconPath: "/assets/icons/add-active.png",
      text: ""
    }, {
      pagePath: "/pages/messages/index",
      iconPath: "/assets/icons/message.png",
      selectedIconPath: "/assets/icons/message-active.png",
      text: "消息"
    }, {
      pagePath: "/pages/profile/index",
      iconPath: "/assets/icons/user.png",
      selectedIconPath: "/assets/icons/user-active.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
    }
  }
})
