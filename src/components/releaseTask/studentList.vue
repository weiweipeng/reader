<template>
	<div id="studentId" class="bg-warp">
		<div class="header-title mui-text-center">
			<a class="mui-icon mui-icon-left-nav" @tap="goBack"></a>
			<span>选择学生</span>
		</div>
		<div id="pullrefresh" class="mui-scroll-wrapper">
			<div class="mui-scroll">
				<div class="list-wrap">
					<form class="mui-input-group">
						<div class="mui-input-row mui-checkbox" v-for="(item, index) in stuList">
							<label class="list-cont">
								<h4 class="mui-ellipsis " v-text="item.stuName"></h4>
								<!--<h5 v-text="'所属年级：' + item.Id"></h5>-->
							</label>
							<input name="checkbox1" class="listCheckBox" :value="item" type="checkbox" v-model="checkStu">
						</div>
					</form>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import store from '@/vuex/store'
	export default {
		name: 'studentList',
		store,
		data: function(){
			return {
				stuList:[],
				checkStu: [],
				classId: ''
				
			}
		},
		watch:{
			checkStu: function(val, oldval){
				store.commit('getStudentList', val);
			}
		},
		activated: function(){
			this.getData();
		},
		methods: {
			getData: function(){
				var _this=this;
				var param={
					'classid':'43'
				}
				var timestamp2 = (new Date()).valueOf()
				this.$http.get('http://loginapi.keys-edu.com/api/UserComIface/getClassStuList?classid=43&_:'+timestamp2, {"emulateJSON":true}).then(function(res){
//					console.log(JSON.parse(res.body));
					var stuData=JSON.parse(JSON.parse(res.body).Data)[0].stuList;
					_this.stuList=stuData;
//					store.commit('getStudentList',);
//					console.log(stuData);
				});
			},
			goBack: function(){
				this.$router.back(-1);
			}
		}
	}
</script>

<style lang="scss">
	#studentId{
		.mui-input-group .mui-input-row{
			height: 1.5rem;
			padding: .2rem 1.2rem .2rem .3rem;
		}
		.list-cont{
			h4{
				font-size: .4rem;
			    font-weight: 700;
			    line-height: 1.7;
			}
			h5{
				font-size: .36rem;
			}
		}
		.mui-checkbox input[type=checkbox]{
			top: 50%;
			margin-top: -15px;
		}
		.mui-checkbox input[type=checkbox]:checked:before{
			color: #57b273;
		}
		.mui-input-group .mui-input-row:last-child:after{
			display: none;
		}
		.mui-input-group:after{
			display: none;
		}
	}
</style>