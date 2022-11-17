import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from '@/router'
import '@/assets/css/reset.css'
import 'yodo-common'
import { injectCommon } from './common/index'
injectCommon()

createApp(App).use(router).use(store).mount('#app')
