import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import path from 'path'
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
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
    autoHideMenuBar: false, // Changed to make the top bar visible
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      enableRemoteModule: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  });

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
ipcMain.on('read-data-file-sync', (event, key) => {
  const filePath = path.join(process.env.APPDATA, 'GitAccountSwitch', `${key}.json`);
  try {
    const data = readFileSync(filePath, 'utf-8');
    console.log("found " + filePath + " returning now")
    console.log(data);
    event.returnValue = data;
  } catch (error) {
    console.log(`Failed to read file for key "${key}"`, error);
    event.returnValue = "{}";
  }
});
ipcMain.on("getDefaultReposLocation", () => {
  const documentsPath = path.join(homedir(), "Documents");
  mkdirSync(documentsPath, { recursive: true });
  return documentsPath;
})

ipcMain.on('write-data-file-sync', (event, key, jsonString) => {
  const filePath = path.join(process.env.APPDATA, 'GitAccountSwitch', `${key}.json`);
  try {
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, jsonString, 'utf-8');
  } catch (error) {
    console.error(`Failed to write file for key "${key}"`, error);
  }
});

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
});


ipcMain.handle('create-new-sshtoken', (event, profileName, accountEmail, accountUsername) => {
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
  # GithubUsername ${accountUsername}
  # Email ${accountEmail}
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
    runStatus.status = "error";
    runStatus.output = error.message;
    console.error("[IPC] command error: " + error.message);
    console.log("----------");
  }
  return runStatus;
}

ipcMain.handle('cloneGitRepo', async (event, repoUrl, repoName, repoParentFolder) => {
  console.log("cloning repo at: " + repoUrl);
  const documentsPath = path.join(repoParentFolder, repoName);
  console.log("cloning to folder: " + documentsPath);
  let cloneStatus = { status: null, output: null, command: `git clone ${repoUrl} ${documentsPath}` };

  try {
    // Create Documents directory if it doesn't exist
    if (!existsSync(path.join(homedir(), 'Documents'))) {
      mkdirSync(path.join(homedir(), 'Documents'), { recursive: true });
    }

    const output = execSync(`git clone ${repoUrl} ${documentsPath}`, { stdio: 'pipe' }).toString();
    cloneStatus.status = "success";
    cloneStatus.output = output;
    console.log("[IPC] Git clone successful:", output);
  } catch (error) {
    cloneStatus.status = "error";
    cloneStatus.output = error.message;
    console.error("[IPC] Git clone failed:", error.message);
  }

  return cloneStatus;
});

ipcMain.handle('setRepoMainUser', async (event, githubURL, githubUsername, githubEmail, repoName, repoParentFolder) => {
  console.log("github url: " + githubURL);
  console.log("github username: " + githubUsername);
  console.log("github email: " + githubEmail);
  console.log("github repo name: " + repoName);
  const repoPath = path.join(repoParentFolder, repoName);
  console.log("changing commit settings at repo folder: " + repoPath)
  let setUserStatus = { status: null, output: null, command: `git config user.name "${githubUsername}" && git config user.email "${githubEmail}" && git remote set-url origin ${githubURL}` };

  try {
    // Navigate to the repo directory and run the commands
    // git -C /path/to/repo config <key> <value>
    const output = execSync(`git -C "${repoPath}" config user.name "${githubUsername}" && git -C "${repoPath}" config user.email "${githubEmail}" && git -C "${repoPath}" remote set-url origin ${githubURL}`, { stdio: 'pipe' }).toString();
    setUserStatus.status = "success";
    setUserStatus.output = output;
    console.log("[IPC] User and remote URL set successfully:", output);
  } catch (error) {
    setUserStatus.status = "error";
    setUserStatus.output = error.message;
    console.error("[IPC] Setting user and remote URL failed:", error.message);
  }

  return setUserStatus;
});
ipcMain.handle("get-repo-commit-details", async (event, repoPath) => {
  console.log("getting details for this repo:")
  console.log(repoPath);
  let outputResults = { name: "", email: "" }
  const getEmailCommand = `git -C ${repoPath} config user.email`
  const getNameCommand = `git -C ${repoPath} config user.name`
  outputResults.name = runCommand(getNameCommand).output;
  outputResults.email = runCommand(getEmailCommand).output;
  return outputResults
});
ipcMain.on('join-path', (event, ...paths) => {
  console.log("paths to join");
  console.log(...paths);
  return path.join(...paths);
});

