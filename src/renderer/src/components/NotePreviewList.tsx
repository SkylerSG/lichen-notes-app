import { notesMock } from '@renderer/store/mocks'
import { ComponentProps } from 'react'
export const NotePreviewList = ({ ...props }: ComponentProps<'ul'>) => {
  return (
    <ul {...props}>
      {notesMock.map((note) => (
        <li className="hover:bg-slate-200/25 transition duration-300 rounded-lg" key={note.title}>
          <span className="ml-2">{note.title}</span>
        </li>
      ))}
    </ul>
  )
}
// 58:58
