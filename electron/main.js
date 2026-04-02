const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const DEFAULT_DATA_DIR = path.join(require('os').homedir(), 'Music', 'KEXP', 'all-shows');

function getDataDir() {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (config.dataDir && fs.existsSync(config.dataDir)) {
      return config.dataDir;
    }
  } catch {}
  return DEFAULT_DATA_DIR;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0d0d0d',
    title: 'Six Degrees Week — KEXP',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, // Allow loading local file:// audio
    },
  });

  win.setMenuBarVisibility(false);

  // Try the built files first; fall back to dev server
  const distIndex = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    win.loadFile(distIndex);
  } else {
    win.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  ipcMain.handle('scan-shows', async () => {
    const dataDir = getDataDir();
    if (!fs.existsSync(dataDir)) {
      return { error: 'Data directory not found: ' + dataDir, shows: [] };
    }

    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    const mp3Files = new Set(files.filter(f => f.endsWith('.mp3')));

    const shows = [];
    for (const jsonFile of jsonFiles) {
      try {
        const jsonPath = path.join(dataDir, jsonFile);
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);
        const baseName = jsonFile.replace('.json', '');
        const mp3File = baseName + '.mp3';

        shows.push({
          filename: baseName,
          json: data,
          hasMP3: mp3Files.has(mp3File),
          mp3Path: 'file:///' + path.join(dataDir, mp3File).replace(/\\/g, '/'),
        });
      } catch (err) {
        console.error('Error reading', jsonFile, err.message);
      }
    }

    return { shows, dataDir };
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
