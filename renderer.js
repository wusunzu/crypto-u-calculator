const { ipcRenderer } = require('electron')

// 接收来自 main.js 的窗口尺寸变化通知
ipcRenderer.on('window-resized', (event, { width, height }) => {
  // 根据窗口宽度动态调整字体大小
  const newFontSize = Math.max(16, width / 50); // 最小字体为16px，窗口宽度决定字体大小
  document.body.style.fontSize = `${newFontSize}px`;
})

