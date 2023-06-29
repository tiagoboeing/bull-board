import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base'
import {
  BullAdapter,
  BullMQAdapter,
  createBullBoard,
  ExpressAdapter
} from '@bull-board/express'
import styles from 'ansis'
import bodyParser from 'body-parser'
import Queue3 from 'bull'
import { ConnectionOptions, Queue as QueueMQ } from 'bullmq'
import { ensureLoggedIn } from 'connect-ensure-login'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import morgan from 'morgan'
import passport from 'passport'
import { Strategy } from 'passport-local'
import path from 'path'
import { handleBasePath } from './utils/base-path/base-path'
import { splitQueueList } from './utils/split-queue-list/split-queue-list'

const environments = {
  port: process.env.PORT || 4000,
  queuePrefix: process.env.QUEUE_PREFIX,
  queueNames: process.env.QUEUE_NAMES || '',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisUsername: process.env.REDIS_USERNAME || 'default',
  redisPassword: process.env.REDIS_PASSWORD || '',
  basePath: process.env.BASE_PATH || '/',

  // auth
  authRequire: process.env.AUTH_REQUIRE || false,
  authLogin: process.env.AUTH_LOGIN || 'bull',
  authPassword: process.env.AUTH_PASSWORD || 'board'
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

const authMiddleware =
  () => (_req: Request, _res: Response, next: NextFunction) => {
    if (!environments.authRequire) return next()

    return ensureLoggedIn({ redirectTo: '/login' })(_req, _res, next)
  }

const run = async () => {
  console.log(styles.yellow('Starting Bull Board with: \n'))

  console.log('Redis')
  console.log(`- redis://${environments.redisHost}:${environments.redisPort}`)
  console.log(`- Username: ${environments.redisUsername}`)
  console.log(
    `- Password: ${environments.redisPassword ? '******' : '<empty>'}`
  )

  console.log('Configs')
  console.log(`- Auth required?: ${environments.authRequire}`)
  console.log(`- Api base path: ${environments.basePath}`)
  console.log(`- Prefix: ${environments.queuePrefix}`)
  console.log(`- Queues: ${environments.queueNames}`)
  console.log('')

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

  const basePath = handleBasePath(environments.basePath)
  console.log(`Base path: ${basePath}`)

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

  if (environments.authRequire) {
    passport.use(
      new Strategy(function (username, password, cb) {
        if (
          username === environments.authLogin &&
          password === environments.authPassword
        ) {
          return cb(null, { user: environments.authLogin })
        }

        return cb(null, false)
      })
    )

    passport.serializeUser(function (user, done) {
      done(null, user)
    })

    passport.deserializeUser(function (user, done) {
      done(null, user)
    })

    // Configure view engine to render EJS templates.
    app.set('views', path.join(__dirname, '/views'))
    app.set('view engine', 'ejs')

    app.use(
      session({ secret: 'keyboard cat', saveUninitialized: true, resave: true })
    )
    app.use(passport.initialize({}))
    app.use(passport.session())

    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/login', (req, res) => {
      res.render('login', { invalid: req.query.invalid === 'true' })
    })

    app.post(
      '/login',
      passport.authenticate('local', {
        failureRedirect: '/login?invalid=true'
      }),
      (_req, res) => {
        res.redirect('/')
      }
    )
  }

  app.use('/', morgan('short'), authMiddleware(), serverAdapter.getRouter())

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
