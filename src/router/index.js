import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '../page/index.vue'
import left from '../components/left.vue'
import right from '../components/right.vue'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'Index', //导入
		component: Index
	}, {
		path: '/leftright',
		components: {
			default: HelloWorld,
			left: left,
			right: right
		}
	}]
})
