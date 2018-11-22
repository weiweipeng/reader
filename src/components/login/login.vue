<template>
	<div id="login">
		<div class="bg-wrap">
			<div class="wrap">
				<div class="logo"></div>
				<div class="icon-inout-wrap">
					<span class="mui-icon mui-icon-person"></span>
					<input id='account' type="text" placeholder="请输入账号" v-model="options.UserAccountId">
				</div>
				<div class="icon-inout-wrap">
					<span class="mui-icon mui-icon-locked"></span>
					<input id='password' type="password" placeholder="请输入密码" v-model="options.UserAccountPassWord">
				</div>
				<button class="submit-btn" :disabled="disable" @click="login">登  录</button>
			</div>
		</div>
	</div>
</template>

<script>
import store from '@/vuex/store'
export default {
  	name: 'login',
  	store,
  	data: function(){
      	return {
      		options: {
				UserAccountId: '',
				UserAccountPassWord: ''
			},
			disable: false
      	}
   	},
   	activated: function(){
   		store.commit('getUserInfo', null);
   	},
   	mounted: function() {
   		
   	},
   	methods: {
   		login: function(){
			var _this = this, options = _this.options;
			if(options.UserAccountId == '' || options.UserAccountPassWord == '') {
				mui.alert('账号/密码不能为空!', '启思教育');
				return false;
			}
//			this.$http.options.emulateJSON = true;
//			this.$http.options.header={
//				 'content-type' : 'application/json'
//			}
			_this.disable = true;
			console.log(this);
			this.$http.post("http://loginapi.keys-edu.com///api/UserAccount/GetUserLogin",{"emulateJSON":true}, options).then(function(res){
				console.log(res.body);
				var data = res.body;
				if(data.ResponseMessage == '登录成功!'){
					//重置
					_this.disable = false;
					if(data.UserType == 2) {
						mui.alert('没有登陆权限!', '启思教育');
						return false;
					} else {
						if(data.classList == null) {
							mui.alert('请先在桌面端进行初始化设置!', '启思教育');
							return false;
						} else {
							//跳转
							store.commit('getUserInfo',data);
							mui.toast(data.ResponseMessage);
							_this.$router.push({path: '/releaseTask'});
						}
					}
				} else {
					//重置
					_this.disable = false;
					mui.alert(data.ResponseMessage, '启思教育');
					return false;
				}
				
				
			},function(err){
				//重置
				_this.disable = false;
				console.log(err);
				mui.alert('暂时无法访问！', '启思教育');
			});
			
		}
   	}
}
</script>
<style lang="scss">
#login{
	
	.wrap{
		position: absolute;
		top: 40%;
		width: 100%;
		text-align: center;
		margin-top: -50%;
		/*-webkit-transform: translate3d(0,-50%,0);
	    transform: translate3d(0,-50%,0);*/
	}
	.logo{
		background: url(../../../static/images/logo.png) no-repeat center center;
		background-size: contain;
		height: 20vh;
		width: 100vw;
	}
	.icon-inout-wrap{
		margin: 5vw 10vw;
		background: rgba(255,255,255,.3);
		border-radius: 1rem;
		height: 1.2rem;
		padding: 0 .3rem;
	}
	.mui-icon-person{
		font-size: .8rem;
	}
	.icon-inout-wrap .mui-icon{
		position: relative;
		padding-right: 0.3rem;
		vertical-align: sub;
		width: 15%;
	}
	.icon-inout-wrap .mui-icon:after{
		position: absolute;
		top: 50%;
		right: 0;
		content: '';
		background: #ccc;
		width: 1px;
		height: .5rem;
		-webkit-transform: translate3d(0,-50%,0);
	    transform: translate3d(0,-50%,0);
	}
	.icon-inout-wrap input{
		width: 80%;
	    border: none;
	    background: none;
	    margin: 0;
	    height: 1.2rem;
	    line-height: 1;
	    font-size: .36rem;
	}
	.submit-btn{
		margin-top: .3rem;
		background: #50b947;
	    color: #fff;
	    border: none;
	    width: 80%;
	    padding: .3rem 0;
	    border-radius: .5rem;
	    font-size: .4rem;
	    line-height: 1;
	}

}

</style>