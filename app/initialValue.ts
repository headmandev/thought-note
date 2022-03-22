import { Descendant } from 'slate'

export const initialValue = (): Descendant[] => [
  {
    type: 'heading',
    children: [
      { text: 'Thought Note' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'area, ', bold: true },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<simple notepad>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Each new note will be saved automatically and you will be able to share with it. ' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Don\'t forget to save an unique link of your own edited note. ' }],
  },
  {
    type: 'paragraph',
    align: 'right',
    children: [{ text: 'Try it out for yourself!' }],
  },
]
