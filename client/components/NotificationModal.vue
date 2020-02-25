<template>
  <div class="fixed inset-0 bg-white flex flex-col">
    <div class="flex justify-end p-3">
      <button @click="$emit('close')">
        <span class="sr-only">Schließen</span>
        <Close />
      </button>
    </div>

    <div class="p-10 flex flex-col items-center my-auto">
      <NotificationGraphic class="mb-12" />
      <p class="font-bold text-center text-3xl mb-6">Knock Knock</p>
      <p>
        Damit wir dich auf deinem Smartphone informieren können, wenn zum Beispiel der
        Einbruchsalarm ausgelöst wird, brauchen wir deine Erlaubnis, Benachrichtigungen zu senden.
        Klicke dafür unten auf den Button. Wir werden dich nicht unnötig nerven. Versprochen!
      </p>
    </div>

    <footer class="flex justify-between mt-auto p-10 w-full">
      <button class="font-bold text-lightgray mr-4" @click="$emit('close')">Später</button>

      <PrimaryButton @click="requestNotifications">
        Benachrichtigungen erlauben
      </PrimaryButton>
    </footer>
  </div>
</template>

<script>
import NotificationGraphic from './NotificationGraphic'
import PrimaryButton from './PrimaryButton'
import appIcon from '../assets/icons/android-chrome-512x512.png'
import doorImage from '../assets/images/door-image.png'

export default {
  components: { NotificationGraphic, PrimaryButton },
  methods: {
    requestNotifications() {
      console.log('Testing...')

      const show = () => {
        navigator.serviceWorker.getRegistration().then(reg => {
          reg.showNotification('Jemand betritt deine Wohnung!', {
            icon: appIcon,
            body: `Die Alarmanlage deines Smart Hubs wurde ausgelöst. Warst du das?`,
            image: doorImage,
            actions: [
              { title: 'Öffnen', action: '/' },
              { title: 'Abschalten', action: '/' },
            ],
          })
        })
      }

      if (Notification.permission === 'default') {
        Notification.requestPermission().then(result => {
          if (result === 'granted') show()
          else console.log('Denied!')
        })
      } else if (Notification.permission === 'granted') show()
    },
  },
}
</script>
