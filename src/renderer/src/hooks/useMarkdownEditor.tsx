import { MDXEditorMethods } from '@mdxeditor/editor'
import { saveNoteAtom, selectedNoteAtom } from '@renderer/store'
import { autoSaveThrottle } from '@shared/constants'
import { NoteContent } from '@shared/models'
import { useAtomValue, useSetAtom } from 'jotai'
import throttle from 'lodash/throttle'
import { useRef } from 'react'

export const useMarkdownEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleAutoSaving = throttle(
    async (content: NoteContent) => {
      if (!selectedNote) return

      console.info(`Auto saving note ${selectedNote.title}`)

      await saveNote(content)
    },
    autoSaveThrottle,
    {
      leading: false,
      trailing: true
    }
  ) // Throttle func to 3s so autosaving is not as often (lower throttle for worse systems?)
  const handleBlur = async () => {
    if (!selectedNote) return
    handleAutoSaving.cancel()
    const content = await editorRef.current?.getMarkdown()
    if (content != null) {
      await saveNote(content)
    }
  }
  return {
    editorRef,
    selectedNote,
    handleAutoSaving,
    handleBlur
  }
}
