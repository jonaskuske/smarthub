import Vue from 'vue'
import { emitToServer, wait } from './'
import { SERVER_ACTIONS } from '../../shared/event-types'

export const notificationState = Vue.observable({
  enabled: false,
  permission: 'Notification' in window && Notification.permission,
  supported: 'serviceWorker' in navigator && 'Notification' in window,
})

/**
 * Determine if we already have an active notification subscription.
 * Ran on first load to set initial state.
 */
async function updateSubscriptionState() {
  if (!notificationState.supported) return false

  const swRegistration = await navigator.serviceWorker.ready
  const subscription = await swRegistration.pushManager.getSubscription()

  // No local subscription, no notifications.
  if (!subscription) {
    notificationState.enabled = false
    return false
  }

  const isSubscribedOnServer = await emitToServer(
    SERVER_ACTIONS.REQUEST_NOTIFICATION_SUBSCRIPTION_STATE,
    subscription,
  )

  if (isSubscribedOnServer) {
    // If we have a subscription and our server knowns about it, enable notifications.
    notificationState.enabled = true
    return true
  } else {
    // Otherwise, the server DB was probably reset so we need to re-subscribe.
    // (this will re-use our existing subscription if its public key is still good)
    return subscribeToNotifications()
  }
}

updateSubscriptionState()

/**
 * Enable notifications by letting the server know about our subscription/endpoint.
 * If we already have an existing subscription which is still valid, we'll re-use that one.
 */
export async function subscribeToNotifications() {
  if (!notificationState.supported) return false

  try {
    const delay = wait(1000) // for cosmetic reasons (⌐■_■)
    const swRegistration = await navigator.serviceWorker.ready
    const existingSubscription = await swRegistration.pushManager.getSubscription()
    const publicKey = await emitToServer(SERVER_ACTIONS.REQUEST_NOTIFICATION_PUBLIC_KEY)

    if (existingSubscription) {
      let existingKey = arrayBufferToBase64(existingSubscription.options.applicationServerKey)
      // For whatever reason, there sometimes is a stray "=" at the end of our
      // locally stored public key? ¯\_(ツ)_/¯
      if (existingKey.endsWith('=') && !publicKey.endsWith('=')) {
        existingKey = existingKey.slice(0, existingKey.length - 1)
      }

      if (existingKey === publicKey) {
        // If the public key is still the same as the one we used for our existing subscription,
        // we can add add that subscription (just to be sure) instead of creating a new one.
        await emitToServer(SERVER_ACTIONS.ADD_NOTIFICATION_SUBSCRIPTION, existingSubscription)
        notificationState.enabled = true
        await delay

        // The server now knows about our existing subscription/endpoint (again?). Job done, return.
        return existingSubscription
      } else {
        // If the public key of our current subscription differs from the one on the server,
        // remove the subscription before moving on and creating a new one.
        await existingSubscription.unsubscribe()
      }
    }

    // Create a subscription and let the server know about it,
    // so it can ping us when there's a notification.
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

/**
 * Disable notifications by unsubscribing. This invalidates the endpoint that was generated
 * as part of our subscription, so we'll also let the server know to prune it.
 */
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

    // We'll let the server know that we're unsubscribing so it can clean its DB
    // and won't try to (unsuccessfully) ping the associated endpoint in the future.
    await emitToServer(SERVER_ACTIONS.REMOVE_NOTIFICATION_SUBSCRIPTION, subscription)

    // Unsubscribe.
    await subscription.unsubscribe()

    notificationState.enabled = false
    await delay
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

/*
 *
 *
 */

/*
 * We need to pass the public key as Uint8Array when subscribing (whyy?),
 * so we need these functions to convert back and forth.
 */
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
