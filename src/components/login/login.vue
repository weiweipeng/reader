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
   		this.disable=false;
   		store.commit('getUserInfo', null);
   	},
   	mounted: function() {
   		//初始化滚动组件
	   		mui.init();
   	},
   	methods: {
   		login: function(){
			var _this = this, options = _this.options;
			if(options.UserAccountId == '' || options.UserAccountPassWord == '') {
				mui.alert('账号/密码不能为空!', '启思教育');
				return false;
			}

			_this.disable = true;

			this.$http.post("http://loginapi.keys-edu.com///api/UserAccount/GetUserLogin" , options,{"emulateJSON":true}).then(function(res){

				var data = res.body;
				var jsonParseData=JSON.parse(data);
				if(jsonParseData.Result == 1){
					var changeData = {};
					store.commit('getAccountDatas',options);
					var getdata=JSON.parse(jsonParseData.Data);
					
					changeData.BuyType=getdata.BuyType;
					changeData.ClassId=getdata.ClassId;
					changeData.CourseId=getdata.CourseId;
					changeData.GradeId=getdata.GradeId;
					changeData.Restime=getdata.Restime;
					changeData.TOKEN=getdata.Token;
					changeData.UserAccountEnum=getdata.UserAccountEnum;
					changeData.UserAccountId=getdata.UserAccountId;
					changeData.UserAccountSchoolId=getdata.UserAccountSchoolId;
					changeData.UserToken=getdata.UserToken;
					var classArr=getdata.ClassId.split('|');
//					console.log(classArr[classArr.length-1]);
//					var firstClass={
//						"name":classArr[classArr.length-1],
//						"Id":classArr[0]
//					}
					var new_classArr=[];
					var repeatBool=true;;
//					new_classArr.push(firstClass);
					for(var i=0;i<classArr.length;i++){
						var followArr={};
						var brief=classArr[i].split(',');
						repeatBool=true;
						for(var j=0;j<new_classArr.length;j++){
							if(new_classArr[j].Id == brief[0]){
								
								repeatBool=false;
							}
						}
						if(repeatBool){
							followArr.name=brief[1];
							followArr.Id=brief[0];
							new_classArr.push(followArr);
							
						}
						
						
					}
					console.log(new_classArr);
					store.commit('getClasses', new_classArr);
					_this.$http.post("http://loginapi.keys-edu.com//api/useraccount/toggleuser" , changeData , {"emulateJSON":true}).then(function(res){
						var jsonAccountData = res.body;
						jsonAccountData = JSON.parse(jsonAccountData);
						if(jsonAccountData.Result == 1){
							var accountData=JSON.parse(jsonAccountData.Data);
							var accountPostData={};
							accountPostData.UserToken=accountData.UserToken;
							accountPostData.School=accountData.UserAccountSchoolId;
							accountPostData.BuyType=accountData.BuyType;
							accountPostData.Restime=accountData.Restime;
							accountPostData.Sign=accountData.Sign;
							accountPostData.Class=accountData.ClassId;
							accountPostData.Grade=accountData.GradeId;
							store.commit('getSchoolId',accountData.UserAccountSchoolId);
							store.commit('getTeacherId',accountData.UserAccountId);
							console.log(accountData);
							_this.$http.post("http://ksapi.keys-edu.com///api/UserToken/GetUserTokenData" , accountPostData , {"emulateJSON":true}).then(function(res){
								var jsonUserSign = JSON.parse(res.body);
								
								store.commit('getUserInfo',jsonUserSign.Data);
//								mui.toast(jsonUserSign.Message);
								_this.$router.push({path: '/releaseTask'});
							},function(err){
//								mui.toast(jsonUserSign.Message);
							});
						}

					},function(err){
						console.log(err);
					});
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