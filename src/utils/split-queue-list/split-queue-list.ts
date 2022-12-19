const captureQueuesInList: RegExp = /^(?<queue>[A-Za-z0-9-_]+)$/

const splitQueuesBy: RegExp = /[;\n\s]+?/

export const splitQueueList = (queueList: string): string[] => {
  const list = queueList.split(splitQueuesBy).filter((name) => {
    const result = captureQueuesInList.exec(name)

    if (!result?.groups?.queue) return false
    return result.groups.queue
  })

  if (!list.length) throw Error('Queue list must be defined!')

  return list
}
