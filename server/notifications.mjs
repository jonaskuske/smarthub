import path from 'path'
import { fileURLToPath } from 'url'
import fs, { promises as fsPromise } from 'fs'
import webpush from 'web-push'
import chalk from 'chalk-template'
import { SERVER_ACTIONS } from '../shared/event-types.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const info = console.log
const fromRoot = (rootPath) => path.resolve(__dirname, '../', rootPath)

const { homepage } = JSON.parse(fs.readFileSync(fromRoot('package.json')))

const PATH_TO_SUBSCRIPTION_DB = fromRoot('data/subscriptions.json')
const PATH_TO_KEY_STORAGE = fromRoot('data/vapid-keys.json')

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || homepage

// If we haven't created VAPID (Voluntary Application Server Identification) keys yet,
// (i.e. on first run), generate new keys and store them in vapid-keys.json
if (!fs.existsSync(PATH_TO_KEY_STORAGE)) {
  info(chalk`Generating VAPID keys at:\n{underline ${PATH_TO_KEY_STORAGE}}\n`)
  fs.writeFileSync(PATH_TO_KEY_STORAGE, JSON.stringify(webpush.generateVAPIDKeys()), 'utf8')

  info(chalk`Using {underline ${VAPID_SUBJECT}} as VAPID subject for push notifications.`)
  info(chalk`(set through {bold "homepage"} in package.json or {bold VAPID_SUBJECT} env variable)`)
}

const vapidKeys = JSON.parse(fs.readFileSync(PATH_TO_KEY_STORAGE))
webpush.setVapidDetails(VAPID_SUBJECT, vapidKeys.publicKey, vapidKeys.privateKey)

// If it doesn't exist yet, create the empty JSON where we'll store all subscriptions
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
  async has(subscription) {
    const data = await subscriptionDB.get()
    return Object.keys(data).includes(subscription.endpoint)
  },
  async add(subscription) {
    const prev = await subscriptionDB.get()
    await subscriptionDB.set({ ...prev, [subscription.endpoint]: subscription })
    return subscription.endpoint
  },
  async remove(endpoint) {
    const { [endpoint]: _, ...rest } = await subscriptionDB.get()
    await subscriptionDB.set(rest)
  },
}

export function attachListeners(socket) {
  // Endpoints/socket events to add or remove subscriptions from our JSON file
  socket.on(SERVER_ACTIONS.ADD_NOTIFICATION_SUBSCRIPTION, async (subscription, doneCallback) => {
    await subscriptionDB.add(subscription)
    doneCallback()
  })
  socket.on(SERVER_ACTIONS.REMOVE_NOTIFICATION_SUBSCRIPTION, async (subscription, doneCallback) => {
    await subscriptionDB.remove(subscription.endpoint)
    doneCallback()
  })

  // Allow clients to request the public key, which they need to create a new subscription
  socket.on(SERVER_ACTIONS.REQUEST_NOTIFICATION_PUBLIC_KEY, (doneCallback) => {
    doneCallback(vapidKeys.publicKey)
  })

  // Let clients check whether their subscription is known to the server.
  // This allows clients to re-add their existing subscription if we ever delete the JSON file
  socket.on(
    SERVER_ACTIONS.REQUEST_NOTIFICATION_SUBSCRIPTION_STATE,
    async (subscription, doneCallback) => {
      const exists = await subscriptionDB.has(subscription)
      doneCallback(exists)
    },
  )
}

/**
 * Sends a notification to all subscriptions that we have stored in our JSON file
 */
export async function sendNotification(message) {
  const payload = JSON.stringify(message)
  const subscriptions = await subscriptionDB.get()

  const toPrune = []

  await Promise.all(
    Object.values(subscriptions).map((subscription) =>
      webpush.sendNotification(subscription, payload).catch(() => {
        // If an endpoint is not reachable, we'll mark it here and remove it from
        // the DB later. This is probably bad but it keeps the JSON file tidy for now.
        // ¯\_(ツ)_/¯
        toPrune.push(subscription.endpoint)
      }),
    ),
  )

  for (const endpoint of toPrune) await subscriptionDB.remove(endpoint)
}
