import Vue from 'vue'
import {Flux, FluxVue} from 'vaf'

import TodoModule from './todo'
import Todo from './Todo.vue'

Vue.use(FluxVue)

let flux = new Flux({
	strict: true // enable this for promise action to resolve data copy
})
flux.declare(TodoModule)

window.Vue = Vue
window.flux = flux

let app = new Vue({
	vaf: new FluxVue(flux),
	el: '#app',
	render: h => h(Todo)
})