/**
 * px 转 rpx 工具函数
 * 小程序中 rpx 是相对单位，以屏幕宽度为基准
 * 通常设计稿基于 375px 宽度，转换比例为 1px = 2rpx
 */

/**
 * 将 px 转换为 rpx
 * @param px px 值
 * @returns rpx 值
 */
export function px2rpx(px: number): number {
  return px * 2;
}

/**
 * 将样式对象中的 px 值转换为 rpx
 * @param style 样式对象
 * @returns 转换后的样式对象
 */
export function convertStylePx2Rpx(style: Record<string, any>): Record<string, any> {
  const convertedStyle: Record<string, any> = {};

  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'string' && value.includes('px')) {
      // 转换字符串中的 px 值
      convertedStyle[key] = value.replace(/(\d+(?:\.\d+)?)px/g, (match, num) => {
        return `${px2rpx(parseFloat(num))}rpx`;
      });
    } else if (typeof value === 'number' && isPixelProperty(key)) {
      // 对于数值类型的像素属性，直接转换
      convertedStyle[key] = `${px2rpx(value)}rpx`;
    } else {
      convertedStyle[key] = value;
    }
  }

  return convertedStyle;
}

/**
 * 判断是否为像素相关的 CSS 属性
 * @param property CSS 属性名
 * @returns 是否为像素属性
 */
function isPixelProperty(property: string): boolean {
  const pixelProperties = [
    'width', 'height', 'top', 'left', 'right', 'bottom',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'fontSize', 'lineHeight', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
    'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius',
    'borderBottomLeftRadius', 'borderBottomRightRadius'
  ];

  return pixelProperties.includes(property);
}

/**
 * 根据设计稿宽度计算 rpx 转换比例
 * @param designWidth 设计稿宽度，默认 375px
 * @returns 转换函数
 */
export function createPx2RpxConverter(designWidth: number = 375) {
  const ratio = 750 / designWidth;

  return function(px: number): number {
    return px * ratio;
  };
}

/**
 * 快捷转换函数，常用尺寸的预设值
 */
export const rpx = {
  4: px2rpx(2),    // 4rpx = 2px
  8: px2rpx(4),    // 8rpx = 4px
  16: px2rpx(8),   // 16rpx = 8px
  24: px2rpx(12),  // 24rpx = 12px
  32: px2rpx(16),  // 32rpx = 16px
  48: px2rpx(24),  // 48rpx = 24px
  64: px2rpx(32),  // 64rpx = 32px
  96: px2rpx(48),  // 96rpx = 48px
  128: px2rpx(64), // 128rpx = 64px
};
