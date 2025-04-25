import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  on: (channel: string, listener: (...args: any[]) => void) =>
    ipcRenderer.on(channel, (_, ...args) => listener(...args))
}); 