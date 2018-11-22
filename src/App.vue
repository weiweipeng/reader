<template>
  <div id="app">
  	<div :class="isIos ? 'bg20' : ''"></div>
    <keep-alive>
      <router-view :class="isIos ? 'main' : ''"></router-view>
   	</keep-alive>
   	<!--tab-->
   	<ul class="tabList mui-text-center" v-show="$store.state.tabListShow">
   		<li>
   			<router-link to="/releaseTask">
					<i class="mui-icon mui-icon-compose"></i>
					<span>布置作业</span>
				</router-link>
   		</li>
			<li>
				<router-link to="/taskList">
					<i class="mui-icon mui-icon-search"></i>
					<span>检查作业</span>
				</router-link>
			</li>
		</ul>
		<!--分割-->
  </div>
</template>

<script>
import store from '@/vuex/store'
export default {
  name: 'app',
  store,
  data: function() {
  	return {
    	isIos: false
  	}
	},
	created: function(){
		if(this.$route.path == '/login'){
			store.commit('tabListHide');
		}
	},
	watch: {
		$route(to, from) {
			var _this = this;
			if(!store.state.userInfo && to.name != 'login'){
				mui.alert('登录过期,请重新登录！',function(){
					_this.$router.push({path: '/login'});
				});
			}
			if(to.name == 'releaseTask' || to.name == 'taskList'){
				if(store.state.tabListShow === false){
					store.commit('tabListShow');
				}
			}else{
				if(store.state.tabListShow === true){
					store.commit('tabListHide');
				}
			}
		}
	},
	mounted: function() {
		this.getSystem();
	},
	methods: {
		getSystem: function(){
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if(isiOS && !isAndroid){
				console.log('ios终端');
				this.isIos = isiOS;
			}
		}
	}
}
</script>

<style lang="scss">
.bg20{
	position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: #fff;
  z-index: 99;
}
.container {
	padding-top: constant(safe-area-inset-top);
	padding-right: constant(safe-area-inset-right);
	padding-bottom: constant(safe-area-inset-bottom);
	padding-left: constant(safe-area-inset-left);
}
body{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
}
#app {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow-y: auto;
  .mui-bar{
  	.mui-icon{
  		padding: 0;
  	}
  }
  
  .tabList{
		position: fixed;
		bottom: 0;
		left: 0;
		background: #fff;
		-webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	  width: 100%;
	  z-index: 99;
	  li{
	  	float: left;
	  	width: 50%;
	  	a{
	  		display: block;
	  		text-align: center;
	  		padding: .1rem .2rem;
	  		height: 1.3rem;
	  		.mui-icon{
	  			color: #999;
			    display: block;
			    font-size: .6rem;
	  		}
	  		span{
	  			color: #929292;
	  			font-size: .34rem;
	  			vertical-align: text-top;
	  		}
	  		&.active{
	  			span{
	  				color: #4aad6a;
	  			}
	  			.mui-icon{
		  			color: #4aad6a;
		  		}
	  		}
	  	}
	  }
	}
	
}
</style>
