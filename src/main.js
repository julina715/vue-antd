import Vue from 'vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import App from './views/App';

Vue.use(VueRouter)
Vue.use(Antd)

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: '*' , redirect: '/foo' }
]
const router = new VueRouter({
    mode: 'history',
    routes
})
new Vue({
    el: '#root',
    router,
    render: h => h(App)
})