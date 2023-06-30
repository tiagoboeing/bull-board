export const handleBasePath = (path?: string): string => {
  if (!path) return '/'
  if (path === '/') return path
  if (path.startsWith('/')) return path

  return `/${path}`
}

export const handleRoutePath = (path: string, basePath?: string): string => {
  const base = handleBasePath(basePath)

  if (path.startsWith('/')) path = path.slice(1)

  if (base === '/') return `/${path}`

  return `${base}/${path}`
}
