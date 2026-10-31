import React, { Fragment, JSX } from 'react'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'

import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'
import { cn } from '@/utilities/cn'

export type NodeTypes = DefaultNodeTypes | SerializedBlockNode<any>

type Props = {
  nodes: NodeTypes[]
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return (
            <>
              <br />
              <br />
            </>
          )
        }

        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>

          if (node.format & IS_BOLD) {
            text = (
              <b className="font-semibold" key={index}>
                {text}
              </b>
            )
          }

          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }

          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            )
          }

          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            )
          }

          if (node.format & IS_CODE) {
            text = <code key={index}>{node.text}</code>
          }

          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }

          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }

          return text
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: NodeTypes): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({ nodes: node.children as NodeTypes[] })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        if (node.type === 'block') {
          const block = node.fields

          const blockType = block?.blockType

          if (!block || !blockType) {
            return null
          }

          switch (blockType) {
            default:
              return null
          }
        } else {
          switch (node.type) {
            case 'linebreak': {
              return <br className="" key={index} />
            }
            case 'paragraph': {
              return (
                <p className="" key={index}>
                  {serializedChildren}
                  <br />
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag

              const headingClass = cn({
                'text-6xl': Tag === 'h1',
                'text-4xl': Tag === 'h2',
                'text-3xl': Tag === 'h3',
                'text-2xl': Tag === 'h4',
              })

              return (
                <Tag className={cn(headingClass, 'font-semibold')} key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'list': {
              const Tag = node?.tag
              return (
                <Tag className="list" key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={` ${node.checked ? '' : ''}`}
                    key={index}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    {serializedChildren}
                  </li>
                )
              } else {
                return (
                  <li key={index} value={node?.value}>
                    {serializedChildren}
                  </li>
                )
              }
            }
            case 'quote': {
              return (
                <blockquote className="" key={index}>
                  {serializedChildren}
                </blockquote>
              )
            }
            default:
              return null
          }
        }
      })}
    </Fragment>
  )
}
