const fs = require('fs');
const path = require('path');

// 创建一个简单的 1x1 像素的透明 PNG
const createTransparentPNG = () => {
  // 这是一个 1x1 透明 PNG 的 base64 编码
  const transparentPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  );
  return transparentPNG;
};

// 需要创建的图标列表
const icons = [
  'home.png',
  'home-active.png',
  'task.png',
  'task-active.png',
  'add.png',
  'add-active.png',
  'message.png',
  'message-active.png',
  'user.png',
  'user-active.png'
];

// 创建图标文件
icons.forEach(iconName => {
  const iconPath = path.join(__dirname, iconName);
  fs.writeFileSync(iconPath, createTransparentPNG());
  console.log(`Created: ${iconName}`);
});

console.log('All placeholder icons created successfully!');
