import path from 'path'
import fs, { promises as fsPromise } from 'fs'
import webpush from 'web-push'
import chalk from 'chalk'
import { SERVER_ACTIONS } from '../shared/event-types'
import { homepage } from '../package.json'

const info = console.log
const fromRoot = rootPath => path.resolve(__dirname, '../', rootPath)

const PATH_TO_SUBSCRIPTION_DB = fromRoot('data/subscriptions.json')
const PATH_TO_KEY_STORAGE = fromRoot('data/vapid-keys.json')

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || homepage

if (!fs.existsSync(PATH_TO_KEY_STORAGE)) {
  info(chalk`Generating VAPID keys at:\n{underline ${PATH_TO_KEY_STORAGE}}\n`)
  fs.writeFileSync(PATH_TO_KEY_STORAGE, JSON.stringify(webpush.generateVAPIDKeys()), 'utf8')

  info(chalk`Using {underline ${VAPID_SUBJECT}} as VAPID subject for push notifications.`)
  info(chalk`(set through {bold "homepage"} in package.json or {bold VAPID_SUBJECT} env variable)`)
}

const vapidKeys = require(PATH_TO_KEY_STORAGE)
webpush.setVapidDetails(homepage, vapidKeys.publicKey, vapidKeys.privateKey)

if (!fs.existsSync(PATH_TO_SUBSCRIPTION_DB)) {
  console.log(chalk`\nCreating subscription DB at:\n{underline ${PATH_TO_SUBSCRIPTION_DB}}`)
  fs.writeFileSync(PATH_TO_SUBSCRIPTION_DB, '{}', 'utf8')
}

const subscriptionDB = {
  async get() {
    const data = await fsPromise.readFile(PATH_TO_SUBSCRIPTION_DB, 'utf8')
    return JSON.parse(data)
  },
  async set(db) {
    const data = JSON.stringify(db, null, 2)
    await fsPromise.writeFile(PATH_TO_SUBSCRIPTION_DB, data, 'utf8')
  },
  async remove(endpoint) {
    const { [endpoint]: _, ...rest } = await subscriptionDB.get()
    await subscriptionDB.set(rest)
  },
}

export function attachListeners(socket) {
  socket.on(SERVER_ACTIONS.ADD_NOTIFICATION_SUBSCRIPTION, async (subscription, doneCallback) => {
    const prev = await subscriptionDB.get()
    await subscriptionDB.set({ ...prev, [subscription.endpoint]: subscription })

    doneCallback()
  })

  socket.on(SERVER_ACTIONS.REMOVE_NOTIFICATION_SUBSCRIPTION, async (subscription, doneCallback) => {
    await subscriptionDB.remove(subscription.endpoint)

    doneCallback()
  })

  socket.on(SERVER_ACTIONS.REQUEST_NOTIFICATION_PUBLIC_KEY, doneCallback => {
    doneCallback(vapidKeys.publicKey)
  })

  socket.on(
    SERVER_ACTIONS.REQUEST_NOTIFICATION_SUBSCRIPTION_STATE,
    async (subscription, doneCallback) => {
      const subscriptions = await subscriptionDB.get()
      const exists = Object.keys(subscriptions).includes(subscription.endpoint)
      doneCallback(exists)
    },
  )
}

export async function sendNotification(message) {
  const payload = JSON.stringify(message)
  const subscriptions = await subscriptionDB.get()

  const toPrune = []

  await Promise.all(
    Object.values(subscriptions).map(subscription =>
      webpush.sendNotification(subscription, payload).catch(() => {
        toPrune.push(subscription.endpoint)
      }),
    ),
  )

  for (const endpoint of toPrune) await subscriptionDB.remove(endpoint)
}
