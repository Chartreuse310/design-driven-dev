import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'

function parseFrontmatter(raw: string): { frontmatter: Record<string, any>, body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { frontmatter: {}, body: raw }

  const frontmatter: Record<string, any> = {}
  for (const line of match[1].split('\n')) {
    const fmMatch = line.match(/^(\w+):\s*(.*)$/)
    if (fmMatch) {
      const key = fmMatch[1]
      let value: any = fmMatch[2].trim()
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((s: string) => s.trim())
      }
      frontmatter[key] = value
    }
  }

  return { frontmatter, body: raw.slice(match[0].length) }
}

export function readContent(collection: string, slug: string): { frontmatter: Record<string, any>, html: string } {
  const filePath = join(process.cwd(), collection, `${slug}.md`)
  const raw = readFileSync(filePath, 'utf-8')
  const { frontmatter, body } = parseFrontmatter(raw)
  return { frontmatter, html: marked(body) as string }
}

export function listContent(collection: string): { slug: string; frontmatter: Record<string, any> }[] {
  const dir = join(process.cwd(), collection)
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const slug = f.replace(/\.md$/, '')
        const raw = readFileSync(join(dir, f), 'utf-8')
        const { frontmatter } = parseFrontmatter(raw)
        return { slug, frontmatter }
      })
  } catch {
    return []
  }
}
