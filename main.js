const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800, // 初始宽度
    height: 600, // 初始高度
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL('index.html')

  // 监听窗口大小变化
  win.on('resize', () => {
    const [width, height] = win.getSize()
    win.webContents.send('window-resized', { width, height })
  })
}

app.whenReady().then(createWindow)
