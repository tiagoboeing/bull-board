export const handleBasePath = (path?: string): string => {
  if (!path) return '/'
  if (path === '/') return path
  if (path.startsWith('/')) return path

  return `/${path}`
}
