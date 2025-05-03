import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

contextBridge.exposeInMainWorld('electronAPI', {
  joinPath: (...paths) => ipcRenderer.sendSync('join-path', ...paths),
  getDefaultReposLocation: (key) => ipcRenderer.send("getDefaultReposLocation"),
  readDataFileSync: (key) => ipcRenderer.sendSync('read-data-file-sync', key),
  writeDataFileSync: (key, jsonString) => ipcRenderer.send('write-data-file-sync', key, jsonString),
  readSSHConfig: () => ipcRenderer.invoke('read-ssh-config'),
  createNewSSHToken: (profileName, accountEmail, accountUsername) => ipcRenderer.invoke('create-new-sshtoken', profileName, accountEmail, accountUsername),
  cloneGitRepo: (repoUrl, repoName, repoParentFolder) => ipcRenderer.invoke("cloneGitRepo", repoUrl, repoName, repoParentFolder),
  setRepoMainUser: (githubURL, githubUsername, githubEmail, repoName, repoParentFolder) => ipcRenderer.invoke('setRepoMainUser', githubURL, githubUsername, githubEmail, repoName, repoParentFolder),
  getRepoCommitDetails: (repoPath) => ipcRenderer.invoke("get-repo-commit-details", repoPath),
  selectFolder: () => ipcRenderer.invoke('dialog:openDirectory')
})
