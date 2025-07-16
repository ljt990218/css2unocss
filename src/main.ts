import { createApp, vaporInteropPlugin } from 'vue'
import App from './App.vue'

import './style.css'
import 'virtual:uno.css'

createApp(App).use(vaporInteropPlugin).mount('#app')

// import { createVaporApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createVaporApp(App).mount('#app')