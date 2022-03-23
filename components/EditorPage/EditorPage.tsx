import { useCallback, useEffect } from 'react'
import {
  SunIcon,
  MoonIcon,
  HeartIcon,
  DocumentAddIcon,
} from '@heroicons/react/outline'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  setIsDark,
  selectIsDark,
  localStorageThemeKey,
  selectTitle,
  selectId,
  defaultTitle,
} from '../../app/AppSlice'
import Editor from '../Editor/Editor'
import { useRouter } from 'next/router'

export default function EditorPage() {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector(selectIsDark)
  const id = useAppSelector(selectId)
  const title = useAppSelector(selectTitle)

  useEffect(() => {
    const html = document.querySelector('html')
    html?.classList[isDark ? 'add' : 'remove']('dark')
  }, [isDark])

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    dispatch(setIsDark(localStorage.getItem(localStorageThemeKey) === 'true'))
  }, [])

  const isNotDefaultTitle = id && title !== defaultTitle

  const changeTheme = useCallback((v: boolean) => dispatch(setIsDark(v)), [])

  return (
    <div className={'bg-white dark:bg-gray-800 duration-300'}>
      <div className="flex flex-col min-h-screen justify-between px-4 sm:px-6 lg:px-8">
        <main className="max-w-7xl mx-auto w-full">
          <div className="relative z-10 flex items-baseline justify-between pt-10 pb-3">
            <h1 className="text-3xl lg:text-6xl font-extrabold text-gray-900 dark:text-white">
              {isNotDefaultTitle ? title : '...'}
            </h1>
            <div className="flex items-center">
              {id ? (
                <a
                  href="/"
                  rel="noreferrer"
                  target="_blank"
                  title="Create new note"
                  className="text-gray-400 hover:text-gray-500 dark:text-white"
                >
                  <DocumentAddIcon className="w-5 h-5" aria-hidden="true" />
                </a>
              ) : (
                ''
              )}
              <button
                type="button"
                title="Change theme"
                className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 dark:text-white"
                onClick={() => changeTheme(!isDark)}
              >
                <span className="sr-only">Theme switcher</span>
                {isDark ? (
                  <SunIcon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <section className="pt-6 pb-24">
            <div className="grid grid-cols-1">
              <div className="lg:col-span-3">
                <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg h-full p-5">
                  <Editor />
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="max-w-7xl w-full mx-auto text-gray-300 dark:text-slate-600 flex justify-end text-xs pb-2">
          <span className="text-gray-400 dark:text-slate-500">
            Thought note{' '}
          </span>
          <span className="pl-1">
            by
            <a
              rel="noreferrer"
              className="pl-1 pr-1"
              target="_blank"
              href="https://github.com/headmandev/thought-note"
            >
              @headmandev
            </a>
            with{' '}
            <HeartIcon
              className="w-4 h-4 inline-block align-top"
              aria-hidden="true"
            />
          </span>
        </footer>
      </div>
    </div>
  )
}
