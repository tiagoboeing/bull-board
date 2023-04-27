import {
  BullAdapter,
  BullMQAdapter,
  createBullBoard,
  ExpressAdapter
} from '@bull-board/express'
import Queue3 from 'bull'
import { ConnectionOptions, Queue as QueueMQ } from 'bullmq'
import express from 'express'
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base'
import styles from 'ansis'
import { splitQueueList } from './utils/split-queue-list/split-queue-list'
import { handleBasePath } from './utils/base-path/base-path'
import morgan from 'morgan'

const environments = {
  port: process.env.PORT || 4000,
  queuePrefix: process.env.QUEUE_PREFIX,
  queueNames: process.env.QUEUE_NAMES || '',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisUsername: process.env.REDIS_USERNAME || 'default',
  redisPassword: process.env.REDIS_PASSWORD || '',
  apiBasePath: process.env.API_BASE_PATH || '/'
}

const redisOptions: ConnectionOptions = {
  host: environments.redisHost,
  port: environments.redisPort,
  username: environments.redisUsername,
  password: environments.redisPassword
}

const createQueue3 = (name: string) =>
  new Queue3(name, {
    redis: redisOptions,
    prefix: environments.queuePrefix
  })

const createQueueMQ = (name: string) =>
  new QueueMQ(name, {
    connection: redisOptions,
    prefix: environments.queuePrefix
  })

const run = async () => {
  console.log(styles.yellow('Starting Bull Board with: \n'))
  console.log('Redis')
  console.log(`- redis://${environments.redisHost}:${environments.redisPort}`)
  console.log(`- Username: ${environments.redisUsername}`)
  console.log(
    `- Password: ${environments.redisPassword ? '******' : '<empty>'}`
  )

  console.log('Configs')
  console.log(`- Prefix: ${environments.queuePrefix}`)
  console.log(`- Queues: ${environments.queueNames}`)

  const app = express()

  const queueBullList: Queue3.Queue<any>[] = []
  const queueBullMqList: QueueMQ<any, any, string>[] = []

  const queuesList = splitQueueList(environments.queueNames)

  for await (const queueName of queuesList) {
    console.log(`Creating processor to queue: "${queueName}"`)

    const queueBull = createQueue3(queueName)
    const queueBullMq = createQueueMQ(queueName)

    queueBullList.push(queueBull)
    queueBullMqList.push(queueBullMq)
  }

  app.use('/add', (req, res) => {
    const opts = req.query.opts || ({} as any)

    if (opts.delay) {
      opts.delay = +opts.delay * 1000 // delay must be a number
    }

    const exampleBull = createQueue3('ExampleBull')
    const exampleBullMq = createQueueMQ('ExampleBullMQ')

    exampleBull.add({ title: req.query.title }, opts)
    exampleBullMq.add('Add', { title: req.query.title }, opts)

    queueBullList.forEach((queue) =>
      queue.add({ title: req.query.title }, opts)
    )
    queueBullMqList.forEach((queue) =>
      queue.add('Add', { title: req.query.title }, opts)
    )

    res.json({
      ok: true
    })
  })

  const basePath = handleBasePath(environments.apiBasePath)

  const serverAdapter: any = new ExpressAdapter()
  serverAdapter.setBasePath(basePath)

  const adaptersList: BaseAdapter[] = []

  queueBullList.forEach((queue) => adaptersList.push(new BullAdapter(queue)))
  queueBullMqList.forEach((queue) =>
    adaptersList.push(new BullMQAdapter(queue))
  )

  createBullBoard({ queues: adaptersList, serverAdapter })

  console.log('')
  console.log('Mapped Queues')
  console.log('Bull adapter:')
  console.log(`${queueBullList.map((queue) => `- ${queue.name}`).join('\n')}`)
  console.log('BullMq adapters:')
  console.log(`${queueBullMqList.map((queue) => `- ${queue.name}`).join('\n')}`)
  console.log('')

  app.use('/', morgan('short'), serverAdapter.getRouter())

  app.listen(environments.port, () => {
    console.log(`Running on ${environments.port}...`)
    console.log(`For the UI, open http://localhost:${environments.port}`)
    console.log(`Make sure Redis is running on port ${environments.redisPort}`)
    console.log('')
    console.log('To populate the queue, run:')
    console.log(
      `  curl http://localhost:${environments.port}/add?title=Example`
    )
    console.log('To populate the queue with custom options (opts), run:')
    console.log(
      `  curl http://localhost:${environments.port}/add?title=Test&opts[delay]=10`
    )
  })
}

run().catch((e) => console.error(e))
