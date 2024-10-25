import { appDirectoryName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { GetNotes } from '@shared/types'
import { ensureDir, stat } from 'fs-extra'
import { readdir } from 'fs/promises' // Not other readdir from fs
import { homedir } from 'os'

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

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}
