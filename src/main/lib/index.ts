import { appDirectoryName, fileEncoding, welcomeNoteString } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readFile, remove, stat, writeFile } from 'fs-extra'
import { readdir } from 'fs/promises' // Not other readdir from fs
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import * as path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}/${appDirectoryName}` // MAKE THIS FOLDER
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir) // Ensure directory exists, if not, create

  const notesFileNames = await readdir(rootDir, {
    // List of strings with all notes file names
    encoding: fileEncoding,
    withFileTypes: false
  })
  // Filter for markdown files only
  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('No notes found! Showing welcome note!')
    const contentWelcomeNote = await readFile(welcomeNoteFile, {
      encoding: fileEncoding
    })
    await writeFile(`${rootDir}/${welcomeNoteString}`, contentWelcomeNote, {
      encoding: fileEncoding
    })
    notes.push(welcomeNoteString)
  }

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename: string) => {
  const rootDir = getRootDir()
  // Markdown read
  return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()
  console.log(`Writing note: ${filename}`)
  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}
export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: path.join(rootDir, 'Untitled.md'),
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })
  if (canceled || !filePath) {
    console.info('Note creation cancelled!')
    return false
  }
  const { name: filename, dir: parentDir } = path.parse(filePath)
  const normalizedParentDir = path.normalize(parentDir) // Windows gimmick
  const normalizedRootDir = path.normalize(rootDir)
  console.info(normalizedParentDir === normalizedRootDir) // Check

  if (normalizedParentDir !== normalizedRootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation of file failed!',
      message: 'All Notes must be saved under the root directory! Avoid using other directories.'
    })
    return false
  }
  console.info(`Creating note at ${filePath}.`)
  await writeFile(filePath, '') // write mty file
  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: 'Are you sure you want to delete this note?',
    buttons: ['Delete', 'Cancel'], // 0 is delete, 1 is cancel
    defaultId: 1,
    cancelId: 1
  })
  if (response === 1) {
    console.info('Note deletion cancelled!')
    return false
  }
  console.info(`Deleting note: ${filename}`)
  await remove(`${rootDir}/${filename}.md`)
  return true
}
