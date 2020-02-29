import Vue from 'vue'
import { emitToServer, wait } from './'
import { SERVER_ACTIONS } from '../../shared/event-types'

export const notificationState = Vue.observable({
  enabled: false,
  permission: 'Notification' in window && Notification.permission,
  supported: 'serviceWorker' in navigator && 'Notification' in window,
})

async function updateSubscriptionState() {
  if (!notificationState.supported) return false

  const swRegistration = await navigator.serviceWorker.ready
  const subscription = await swRegistration.pushManager.getSubscription()

  if (!subscription) {
    notificationState.enabled = false
    return false
  }

  const isSubscribedOnServer = await emitToServer(
    SERVER_ACTIONS.REQUEST_NOTIFICATION_SUBSCRIPTION_STATE,
    subscription,
  )

  if (isSubscribedOnServer) {
    notificationState.enabled = true
    return true
  } else {
    return subscribeToNotifications()
  }
}

updateSubscriptionState()

export async function subscribeToNotifications() {
  if (!notificationState.supported) return false

  try {
    const delay = wait(1000)
    const swRegistration = await navigator.serviceWorker.ready
    const existingSubscription = await swRegistration.pushManager.getSubscription()
    const publicKey = await emitToServer(SERVER_ACTIONS.REQUEST_NOTIFICATION_PUBLIC_KEY)

    if (existingSubscription) {
      let existingKey = arrayBufferToBase64(existingSubscription.options.applicationServerKey)
      if (existingKey.endsWith('=') && !publicKey.endsWith('=')) {
        existingKey = existingKey.slice(0, existingKey.length - 1)
      }

      if (existingKey === publicKey) {
        await emitToServer(SERVER_ACTIONS.ADD_NOTIFICATION_SUBSCRIPTION, existingSubscription)
        notificationState.enabled = true

        await delay
        return existingSubscription
      } else {
        await existingSubscription.unsubscribe()
      }
    }

    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })

    await emitToServer(SERVER_ACTIONS.ADD_NOTIFICATION_SUBSCRIPTION, subscription)
    notificationState.enabled = true

    await delay
    return subscription
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function unsubscribeFromNotifications() {
  if (!notificationState.supported) return false

  try {
    const delay = wait(1000)
    const swRegistration = await navigator.serviceWorker.ready
    const subscription = await swRegistration.pushManager.getSubscription()

    // Not subscribed to begin with? Immediately return
    if (!subscription) {
      notificationState.enabled = false
      return true
    }

    // Remove subscription, invalidates endpoint
    await emitToServer(SERVER_ACTIONS.REMOVE_NOTIFICATION_SUBSCRIPTION, subscription)
    await subscription.unsubscribe()
    notificationState.enabled = false
    await delay
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function arrayBufferToBase64(buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
