const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const Store = require('electron-store');

// 创建 electron-store 实例，用来保存窗口的尺寸和锁定状态
const store = new Store();

function createWindow() {
  // 从存储中获取窗口的尺寸，默认设置为 900x800
  let width = store.get('windowWidth') || 900;
  let height = store.get('windowHeight') || 800;

  // 获取是否锁定窗口的状态
  let isResizable = store.get('isResizable') !== false;

  const win = new BrowserWindow({
    width: width,
    height: height,
    resizable: isResizable,  // 根据锁定状态来决定是否允许调整窗口大小
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadFile('index.html');

  // 监听窗口大小变化，并保存
  win.on('resize', () => {
    const [newWidth, newHeight] = win.getSize();
    store.set('windowWidth', newWidth);
    store.set('windowHeight', newHeight);
  });

  // 创建任务栏菜单，添加锁定窗口功能
  const menu = Menu.buildFromTemplate([
    {
      label: 'Window',
      submenu: [
        {
          label: 'Lock Window Size',
          type: 'checkbox',
          checked: !isResizable,  // 如果窗口是锁定的，勾选框显示为选中
          click: (menuItem) => {
            const locked = menuItem.checked;
            store.set('isResizable', !locked);  // 保存锁定状态
            win.setResizable(!locked);  // 设置窗口是否可以调整大小
          }
        },
        { type: 'separator' },
        {
          role: 'quit'
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


