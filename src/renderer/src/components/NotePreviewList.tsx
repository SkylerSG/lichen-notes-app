import { NotePreview } from '@/components'
import { notesMock } from '@renderer/store/mocks'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
export const NotePreviewList = ({ className, ...props }: ComponentProps<'ul'>) => {
  if (notesMock.length == 0) {
    return (
      <ul className="pt-3">
        <span className={twMerge('text-center text-white/75', className)} {...props}>
          No notes have been taken!
        </span>
      </ul>
    )
  }
  return (
    <ul className={className} {...props}>
      {notesMock.map((note) => (
        <NotePreview key={note.title + note.lastEditTime} {...note} />
      ))}
    </ul>
  )
}
