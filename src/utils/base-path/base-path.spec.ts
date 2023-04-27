import { describe, test, expect } from '@jest/globals'
import { handleBasePath } from './base-path'

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
