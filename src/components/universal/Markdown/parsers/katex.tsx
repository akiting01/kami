import type { MarkdownToJSX } from 'markdown-to-jsx'
import {
  Priority,
  parseCaptureInline,
  simpleInlineRegex,
} from 'markdown-to-jsx'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { loadScript, loadStyleSheet } from '~/utils/load-script'

//  $ c = \\pm\\sqrt{a^2 + b^2} $
export const KateXRule: MarkdownToJSX.Rule = {
  match: simpleInlineRegex(
    /^\$\s{1,}((?:\[.*?\]|<.*?>(?:.*?<.*?>)?|`.*?`|.)*?)\s{1,}\$/,
  ),
  order: Priority.LOW,
  parse: parseCaptureInline,
  react(node, output, state?) {
    try {
      const str = node.content.map((item) => item.content).join('')

      return <LateX key={state?.key}>{str}</LateX>
    } catch {
      return null as any
    }
  },
}

const LateX: FC<{ children: string }> = (props) => {
  const { children } = props

  const [html, setHtml] = useState('')

  useEffect(() => {
    loadStyleSheet(
      'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.css',
    )
    loadScript(
      'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.js',
    ).then(() => {
      const html = window.katex.renderToString(children)
      setHtml(html)
    })
  }, [])

  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
