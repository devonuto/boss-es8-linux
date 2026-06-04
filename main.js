const { app, BrowserWindow, session } = require('electron');
const path = require('path');

process.on('unhandledRejection', (reason) => {
  console.log('Intercepted unhandled device rejection:', reason);
});

function createWindow () {
  // Automatically intercept and approve the hardware MIDI request inside the container
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'midi' || permission === 'midiSysex') return true;
    return false;
  });
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'midi' || permission === 'midiSysex') return callback(true);
    return callback(false);
  });

  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    title: 'BOSS ES-8 Editor (Community Linux Port)',
    icon: path.join(__dirname, 'app-core', 'images', 'boss-es8-editor.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  // Launch the core index file directly
  win.loadFile(path.join(__dirname, 'app-core', 'index.html'));
  
  // Remove the standard window browser menu for a clean native app look
  win.setMenu(null);
}

app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-dev-shm-usage');

app.whenReady().then(createWindow);
