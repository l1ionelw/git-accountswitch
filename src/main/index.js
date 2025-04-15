import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import path from 'path'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import SSHConfig from 'ssh-config'
import { execSync } from 'child_process'
import { appendFileSync } from 'fs'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('read-ssh-config', async () => {
  try {
    console.log(homedir());
    const sshConfigPath = path.join(homedir(), '.ssh', 'config')
    const content = readFileSync(sshConfigPath, 'utf-8')
    const client = SSHConfig.parse(content); // list of jsons
    return client;
  } catch (error) {
    console.log(error.message)
    return `Error reading file: ${error.message}`
  }
})
ipcMain.handle('create-new-sshtoken', (event, profileName, accountEmail) => {
  console.log(profileName);
  console.log(accountEmail);
  let commandOutputs = [];
  // generate file
  let command = `ssh-keygen -t rsa -b 4096 -C "${accountEmail}" -f ${path.join(homedir(), '.ssh', `${profileName}`)} -N ""`;
  commandOutputs.push(runCommand(command));
  // add to ssh
  const addCommand = `ssh-add ${path.join(homedir(), '.ssh', `${profileName}`)}`;
  commandOutputs.push(runCommand(addCommand));
  // append to config 
  let writeStatus, writeMessage = "", sshConfigPath, sshConfigEntry;
  try {
    sshConfigEntry = `
Host ${profileName}
    HostName github.com
    User git
    IdentityFile ~/.ssh/${profileName}
`;
    sshConfigPath = path.join(homedir(), '.ssh', 'config');
    appendFileSync(sshConfigPath, sshConfigEntry, 'utf8');
    console.log(`SSH config entry added for ${profileName}`);
    writeStatus = "success";
  } catch (e) {
    console.log(e.message);
    writeStatus = "error";
    writeMessage = e.message;
  }
  commandOutputs.push({ status: writeStatus, output: writeMessage, command: `appendFileSync(${sshConfigPath}, ${sshConfigEntry}, 'utf-8')` });
  // get the ssh pub file
  const pubFilePath = path.join(homedir(), '.ssh', `${profileName}.pub`);
  let pubFileContent, readStatus;
  try {
    pubFileContent = readFileSync(pubFilePath, 'utf-8');
    readStatus = "success";
  } catch (error) {
    console.error("Error reading public key file:", error.message);
    pubFileContent = `Error reading file: ${error.message}`;
    readStatus = "error";
  }
  commandOutputs.push({ step: "readSSHKey", status: readStatus, output: pubFileContent, command: `readFileSync(${pubFilePath}, 'utf-8')` });
  return commandOutputs;
});

function runCommand(commandString) {
  let runStatus = { status: null, output: null, command: commandString }
  console.log("----------");
  console.log("[IPC] running command: " + commandString);
  try {
    const output = execSync(commandString, { stdio: 'pipe' }).toString();
    runStatus.status = "success";
    runStatus.output = output;
    console.log("[IPC] command output: " + output);
    console.log("----------");
  } catch (error) {
    runStatus.status = "success";
    runStatus.output = output;
    console.error("[IPC] command error: " + error.message);
    console.log("----------");
  }
  return runStatus;
}