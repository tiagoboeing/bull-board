import { describe, test, expect } from '@jest/globals'
import { handleBasePath, handleRoutePath } from './base-path'

describe('BasePath', () => {
  test('should return "/" when path is undefined', () => {
    expect(handleBasePath()).toBe('/')
  })

  test('should return "/" when path is "/"', () => {
    expect(handleBasePath('/')).toBe('/')
  })

  test('should return path with "/" when passing without "/"', () => {
    expect(handleBasePath('test')).toBe('/test')
  })

  test('should return path with "/" when passing with "/"', () => {
    expect(handleBasePath('/test')).toBe('/test')
  })

  test('should work with subpaths', () => {
    expect(handleBasePath('test/subpath')).toBe('/test/subpath')
    expect(handleBasePath('/test/subpath')).toBe('/test/subpath')
  })
})

describe('handleRoutePath()', () => {
  test('should work without basePath', async () => {
    expect(handleRoutePath('login', '/')).toBe('/login')
    expect(handleRoutePath('/login', '/')).toBe('/login')

    expect(handleRoutePath('/login')).toBe('/login')
    expect(handleRoutePath('login')).toBe('/login')
    expect(handleRoutePath('login', '')).toBe('/login')
    expect(handleRoutePath('login', undefined)).toBe('/login')
    expect(handleRoutePath('login', null as never)).toBe('/login')
  })

  test('should work with basePath', async () => {
    expect(handleRoutePath('login', '/bull')).toBe('/bull/login')
    expect(handleRoutePath('/login', '/bull')).toBe('/bull/login')
  })
})
