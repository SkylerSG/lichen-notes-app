import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error(
    'contextIsolation must be enabled in the renderer process for this preload script to work.'
  )
}
try {
  contextBridge.exposeInMainWorld('context', {
    //TODO
  })
} catch (error) {
  console.log(error)
}
