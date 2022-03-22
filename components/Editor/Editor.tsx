import React, { useCallback, useEffect, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import { cx, css } from '@emotion/css'

import { Button, Icon, Toolbar } from './components'
import { CustomEditor, CustomElement } from '../custom-types'
import { RenderElementProps } from 'slate-react/dist/components/editable'
import { Property } from 'csstype'
import TextAlign = Property.TextAlign
import { useAppDispatch, useAppSelector, usePrevious } from '../../app/hooks'
import {
  createNoteAsync,
  saveDataAsync,
  selectData,
  selectId,
  updateData,
} from '../../app/AppSlice'
import { useDebouncedCallback } from 'use-debounce'
import { useRouter } from 'next/router'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const EditorComponent = () => {
  const dispatch = useAppDispatch()

  const id = useAppSelector(selectId)
  const data = useAppSelector(selectData)
  const router = useRouter()
  const { id: queryId } = router.query

  const prevData = usePrevious<typeof data>(data)

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const savingDebounced = useDebouncedCallback(() => {
    if (id) {
      dispatch(saveDataAsync())
      return
    }

    dispatch(createNoteAsync())
  }, 2000)

  useEffect(() => {
    if (!id || id === queryId) return
    const newUrl = `/${id}`
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    )
  }, [id])

  useEffect(() => {
    if (prevData && prevData !== data) savingDebounced()
  }, [data])

  const saveData = useCallback(
    (value: Descendant[]) => dispatch(updateData(value)),
    []
  )

  return (
    <Slate editor={editor} value={data} onChange={saveData}>
      <Toolbar className="border-b-2 border-dashed border-gray-200 dark:border-slate-700">
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
        <BlockButton format="justify" icon="format_align_justify" />
      </Toolbar>
      <Editable
        className={cx(
          'prose dark:prose-invert lg:prose-2xl w-full max-w-full',
          css`
            p,
            li {
              margin-bottom: 0;
              margin-top: 0;
            }
          `
        )}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (!isHotkey(hotkey, event)) return
            event.preventDefault()
            const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS]
            toggleMark(editor, mark)
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  const newProperties: Partial<SlateElement> = {
    ...(TEXT_ALIGN_TYPES.includes(format)
      ? {
          align: isActive ? undefined : format,
        }
      : {
          type: isActive
            ? 'paragraph'
            : isList
            ? 'list-item'
            : (format as CustomElement['type']),
        }),
  }

  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block as CustomElement)
  }
}

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
    return
  }

  Editor.addMark(editor, format, true)
}

const isBlockActive = (
  editor: CustomEditor,
  format: string,
  blockType = 'type'
) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof CustomElement] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format as keyof typeof marks] === true : false
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: element.align as TextAlign }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: React.ReactNode
  leaf: any
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event: Event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }: { format: string; icon: string }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: Event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

export default EditorComponent
