import Vue from 'vue'
import Router from 'vue-router'
//子页面
import login from '@/components/login/login'
import releaseTask from '@/components/releaseTask/releaseTask'
import classList from '@/components/releaseTask/classList'
import articleList from '@/components/releaseTask/articleList'
import taskList from '@/components/taskList/taskList'
import taskDetail from '@/components/taskList/taskDetail'
import studentList from '@/components/releaseTask/studentList'


Vue.use(Router)

export default new Router({
	'linkActiveClass': 'active',
  routes: [
  	{
	    path: '/',
	    redirect: 'login'
	  },
	  {
   		name: 'login',
  		path: '/login',
  		component: login
	  },
	  {
   		name: 'releaseTask',
  		path: '/releaseTask',
  		component: releaseTask
	  },
	  {
	  	name: 'studentList',
	  	path: '/studentList',
	  	component: studentList
	  },
	  {
   		name: 'classList',
  		path: '/classList',
  		component: classList
	  },
	  {
   		name: 'articleList',
  		path: '/articleList',
  		component: articleList
	  },
	  {
   		name: 'taskList',
  		path: '/taskList',
  		component: taskList
	  },
	  {
   		name: 'taskDetail',
  		path: '/taskDetail',
  		component: taskDetail
	  }
  ]
})
