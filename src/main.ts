import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from '@/router'
import eventBus from '@/common/eventBus'
import '@/assets/css/reset.css'
import 'yodo-common'
import { injectCommon } from './common/index'
injectCommon()
const app = createApp(App)
app.config.globalProperties.$bus = eventBus
app.use(router).use(store).mount('#app')
