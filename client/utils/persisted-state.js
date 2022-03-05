import { reactive, watch } from 'vue'
const PERSIST_KEY = '_SMARTHUB_PERSISTED_STATE_'

const initialPersistedState = {
  name: 'Erdling',
}

/** @type {typeof initialPersistedState} */
export const persistedState = reactive(
  JSON.parse(localStorage.getItem(PERSIST_KEY)) || initialPersistedState,
)

watch(persistedState, (nextState) => localStorage.setItem(PERSIST_KEY, JSON.stringify(nextState)), {
  deep: true,
  immediate: true,
})
