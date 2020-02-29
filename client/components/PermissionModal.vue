<template>
  <div class="fixed inset-0 bg-white flex flex-col">
    <div class="flex justify-end p-3 mx-auto w-full lg:max-w-2xl lg:mt-auto lg:p-0">
      <button class="lg:-mr-6" @click="$emit('close')">
        <span class="sr-only">Schließen</span>
        <Close />
      </button>
    </div>

    <div class="p-10 flex flex-col items-center my-auto lg:my-0">
      <NotificationGraphic class="mb-12" />
      <p class="font-bold text-center text-3xl mb-6">Knock Knock</p>
      <p class="max-w-2xl lg:text-justify">
        Damit wir dich auf deinem Smartphone informieren können, wenn zum Beispiel der
        Einbruchsalarm ausgelöst wird, brauchen wir deine Erlaubnis, Benachrichtigungen zu senden.
        Klicke dafür unten auf den Button. Wir werden dich nicht unnötig nerven. Versprochen!
      </p>
    </div>

    <footer
      class="flex justify-between mx-auto mt-auto p-10 w-full lg:mt-0 lg:mb-auto lg:px-0 lg:max-w-2xl"
    >
      <button class="font-bold text-lightgray mr-4 lg:mr-8 lg:ml-auto" @click="$emit('close')">
        Später
      </button>

      <PrimaryButton @click="requestNotifications">
        Benachrichtigungen erlauben
      </PrimaryButton>
    </footer>

    <div class="hidden lg:block lg:mb-auto" />
  </div>
</template>

<script>
import NotificationGraphic from './NotificationGraphic'
import PrimaryButton from './PrimaryButton'
import { notificationState } from '../utils'

export default {
  components: { NotificationGraphic, PrimaryButton },
  methods: {
    requestNotifications() {
      Notification.requestPermission().then(result => {
        notificationState.permission = result
        if (result === 'granted') this.$emit('granted')
        if (result === 'denied') this.$emit('close')
      })
    },
  },
}
</script>
