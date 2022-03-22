import {
  Descendant,
  BaseEditor,
} from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type BlockQuoteElement = {
  type: 'block-quote'
  align?: string
  children: Descendant[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  align?: string
  children: Descendant[]
}

export type NumberedListElement = {
  type: 'numbered-list'
  align?: string
  children: Descendant[]
}

export type HeadingElement = {
  type: 'heading'
  align?: string
  children: Descendant[]
}

export type HeadingTwoElement = {
  type: 'heading-two'
  align?: string
  children: Descendant[]
}

export type ListItemElement = { type: 'list-item'; align?: string; children: Descendant[] }

export type ParagraphElement = {
  type: 'paragraph'
  align?: string
  children: Descendant[]
}

type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | HeadingElement
  | HeadingTwoElement
  // | LinkElement
  | ListItemElement
  | ParagraphElement

export type CustomText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  text: string
}

export type EmptyText = {
  text: string
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText | EmptyText
  }
}
