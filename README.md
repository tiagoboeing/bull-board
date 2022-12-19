# <img alt="@bull-board" src="https://raw.githubusercontent.com/felixmosh/bull-board/master/packages/ui/src/static/images/logo.svg" width="35px" /> @bull-board

<p>
  <a href="https://github.com/tiagoboeing/bull-board/blob/master/LICENSE">
    <img alt="licence" src="https://img.shields.io/github/license/tiagoboeing/bull-board">
  </a>
  <img alt="open issues" src="https://img.shields.io/github/issues/tiagoboeing/bull-board"/>
<p>

**Docker version for `bull-board`.**

> Bull Dashboard is a UI built on top of [Bull](https://github.com/OptimalBits/bull) or [BullMQ](https://github.com/taskforcesh/bullmq) to help you visualize your queues and their jobs.
> With this library you get a beautiful UI for visualizing what's happening with each job in your queues, their status and some actions that will enable you to get the job done.

![UI](https://raw.githubusercontent.com/felixmosh/bull-board/master/screenshots/dashboard.png)

## Notes

This repository is a enhancement for original source at the repository [`felixmosh/bull-board`](https://github.com/felixmosh/bull-board)

**As this library provides only the visualization for your queues, keep in mind that:**

- You must have either [Bull](https://github.com/OptimalBits/bull) or [BullMQ](https://github.com/taskforcesh/bullmq) installed in your projects;
- Aside the options to retry and clean jobs, this library is not responsible for processing the jobs, reporting progress or any other thing. This must be done in your application with your own logic;
- If you want to understand the possibilities you have with the queues please refer to [Bull's docs](https://optimalbits.github.io/bull/) or [BullMQ's docs](https://docs.bullmq.io/);
- This library doesn't hijack Bull's way of working.

If you want to learn more about queues ([Bull](https://github.com/OptimalBits/bull) or [BullMQ](https://github.com/taskforcesh/bullmq)) and [Redis](https://redis.io/).

## Starting

### With Docker Compose

Declare the following service on your Docker Compose:

```docker
version: '3'

name: my-service
services:
  bull-monitor:
    container_name: bull-monitor
    image: tiagoboeing/bull-board:latest
    restart: always
    ports:
      - 4000:4000
    environment:
      QUEUE_PREFIX: 'bull'
      QUEUE_NAMES: |
        ExampleBullMQ;
        ExampleBull
    networks:
      - app-network
    depends_on:
      - redis

  redis:
    container_name: redis
    image: redis:6.2.3-alpine
    ports:
      - 6379:6379
    networks:
      - app-network

networks:
  app-network:
```

### Without Docker Compose

```docker
docker run \
  -e "QUEUE_PREFIX=bull" \
  -e "QUEUE_NAMES=ExampleBullMQ;ExampleBull" \
  tiagoboeing/bull-board:latest
```

> Check if Redis is Running and exposing ports!

## Developing

This project requires that you have a Redis instance running (you can simply run the `docker-compose.yml` to start the stack, use `npm run start:docker`).

Now, to try it out locally you can run:

```sh
npm run start:dev
```

The UI will be available at `http://localhost:4000`

# License

The original project is licensed under [MIT License](https://github.com/felixmosh/bull-board/blob/master/LICENSE), so it means it's completely free to use and copy. I decided to keep this available for all and free keeping the same license as the original on this repository and respecting the original creators.
