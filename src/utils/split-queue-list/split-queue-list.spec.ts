import { describe, test, expect } from '@jest/globals'
import { splitQueueList } from './split-queue-list'

describe('SplitQueueList', () => {
  test('should works with only one queue', () => {
    const output = splitQueueList('queue1')
    expect(output).toEqual(['queue1'])
  })

  test('should works with repeated queue names', () => {
    const output = splitQueueList('queue1;queue1')
    expect(output).toEqual(['queue1', 'queue1'])
  })

  test('should split list without line breaks', () => {
    const output = splitQueueList('queue1;queue2')
    expect(output).toEqual(['queue1', 'queue2'])

    const output2 = splitQueueList('ExampleBullMQ;ExampleBull;')
    expect(output2).toEqual(['ExampleBullMQ', 'ExampleBull'])
  })

  test('should split list with line breaks', () => {
    const output = splitQueueList(`ExampleBullMQ;
ExampleBull`)
    expect(output).toEqual(['ExampleBullMQ', 'ExampleBull'])

    const output2 = splitQueueList(`ExampleBullMQ;
ExampleBull;`)
    expect(output2).toEqual(['ExampleBullMQ', 'ExampleBull'])
  })

  test('should trim empty chars', () => {
    const output = splitQueueList(' ExampleBullMQ; ExampleBull ')
    expect(output).toEqual(['ExampleBullMQ', 'ExampleBull'])

    const output2 = splitQueueList(' ExampleBullMQ; ExampleBull; ')
    expect(output2).toEqual(['ExampleBullMQ', 'ExampleBull'])
  })

  test('should trim empty chars with line breaks', () => {
    const output = splitQueueList(`ExampleBullMQ; 
    ExampleBull `)
    expect(output).toEqual(['ExampleBullMQ', 'ExampleBull'])

    const output2 = splitQueueList(`ExampleBullMQ; 
    ExampleBull; `)
    expect(output2).toEqual(['ExampleBullMQ', 'ExampleBull'])
  })

  describe('Special value', () => {
    test('should accept values with special types', () => {
      expect(() => splitQueueList('queue1-suffix')).not.toThrow()
      expect(() => splitQueueList('queue1-suffix;')).not.toThrow()
      expect(() => splitQueueList('queue1-suffix;queue2-suffix')).not.toThrow()

      expect(() => splitQueueList('queue1_suffix')).not.toThrow()
      expect(() => splitQueueList('queue1_suffix;')).not.toThrow()
      expect(() => splitQueueList('queue1_suffix;queue2_suffix')).not.toThrow()
    })
  })

  describe('Errors', () => {
    test('should throw error when queue list is empty', () => {
      const expectedError = /must be defined/

      expect(() => splitQueueList('')).toThrowError(expectedError)
      expect(() => splitQueueList('queue1,queue2')).toThrowError(expectedError)
      expect(() => splitQueueList('queue1|queue2')).toThrowError(expectedError)
      expect(() => splitQueueList('queue1/queue2')).toThrowError(expectedError)
      expect(() => splitQueueList('queue1\\queue2')).toThrowError(expectedError)
    })
  })
})
