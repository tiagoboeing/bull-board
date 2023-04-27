export const handleBasePath = (path?: string) => {
  if (!path) return '/'
  if (path === '/') return path
  if (path.startsWith('/')) return path

  return `/${path}`
}
