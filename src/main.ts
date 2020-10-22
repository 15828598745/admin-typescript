import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import '@/permission'
import '@/utils/error-log'
import * as directives from '@/directives'
import * as filters from '@/filters'

Vue.use(ElementUI, {
  size: AppModule.size,
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
