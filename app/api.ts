import { Descendant } from 'slate'

export interface TextInfo {
  id: string
  data: Descendant[]
  error?: string
}

export async function fetchNote(id: string): Promise<TextInfo> {
  const res = await fetch(`${process.env.API_URL}/notes/${id}`)
  return res.json()
}


export async function saveNote(id: string, data: Descendant[]): Promise<TextInfo> {
  const response = await fetch(`${process.env.API_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: { data } }),
  })
  return response.json()
}


export async function createNote(data: Descendant[]): Promise<TextInfo> {
  const response = await fetch(`${process.env.API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note: { data } }),
  })
  return response.json()
}
