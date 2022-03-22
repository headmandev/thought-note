import React, { Ref, PropsWithChildren, LegacyRef, forwardRef } from 'react'
import { cx, css } from '@emotion/css'

interface BaseProps {
  className: string

  [key: string]: unknown
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
    >,
    ref: LegacyRef<HTMLSpanElement>
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        ...(reversed
          ? [
              active
                ? 'text-white dark:text-gray-500'
                : 'text-gray-600 dark:text-white',
            ]
          : [
              active
                ? 'text-black dark:text-white'
                : 'text-gray-300 dark:text-slate-500',
            ]),
        css`
          cursor: pointer;
        `
      )}
    />
  )
)

export const Icon = forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: LegacyRef<HTMLSpanElement> | undefined
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        'material-icons',
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `
      )}
    />
  )
)

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: LegacyRef<HTMLDivElement>
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }

          & > * + * {
            margin-left: 15px;
          }
        `
      )}
    />
  )
)

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          margin-bottom: 20px;
        `
      )}
    />
  )
)
