<template>
	<div id="classList" class="bg-wrap">
		<!--header-->
		<div class="header-title mui-text-center">
			<a class="mui-icon mui-icon-left-nav" @tap="goBack"></a>
			<span>选择班级</span>
		</div>
		<div id="pullrefresh" class="mui-scroll-wrapper" >
			<div class="mui-scroll" v-if="tarskTypes === 0">
				<div class="list-wrap">
					<form class="mui-input-group">
						<div class="mui-input-row mui-checkbox" v-for="(item, index) in classList">
							<label class="list-cont">
								<h4 class="mui-ellipsis " v-text="item.name"></h4>
								<!--<h5 v-text="'所属年级：' + item.Id"></h5>-->
							</label>
							<input name="checkbox1" class="listCheckBox" :value="item" type="checkbox" v-model="checkClass" >

						</div>
						
					</form>
				</div>
					
			</div>
			
			<div class="mui-scroll"  v-if="tarskTypes === 1">
				<div class="list-wrap">
					<form class="mui-input-group">
						<div class="mui-input-row mui-radio" v-for="(item, index) in classList" >
							<label class="list-cont">
								<h4 class="mui-ellipsis " v-text="item.name"></h4>
								<!--<h5 v-text="'所属年级：' + item.Id"></h5>-->
							</label>

							<input  name="radio1" class="listRadioBox" :value="item" type="radio" v-model="checkClass">
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
  	name: 'classList',
  	store,
  	data: function(){
      	return {
      		classList: [],
			checkClass: [],
			tarskTypes:0
      	}
   	},
   	watch:{
		checkClass: function(val, oldval){
			console.log(val)
			console.log(this.classList);
			console.log(this.checkClass);
			if(store.state.classOrPerson){
				var arr=[];
				arr.push(val);
				store.commit('getCheckClass', arr);
			}else{
				store.commit('getCheckClass', val);
			}
			
		}
	},
   	activated: function() {
   		var _this = this;
   		if(store.state.classes){
   			this.classList = store.state.classes;
   		}
   		this.checkClass=[];
   		console.log(1111);
   		console.log(store.state.classOrPerson);
   		console.log(this.checkClass);
   		if(store.state.classOrPerson){
   			_this.tarskTypes=1;
   		}else{
   			_this.tarskTypes=0;
   		}
// 		console.log(this.tarskTypes);
// 		console.log(this.classList);
   	},
   	mounted: function() {
   		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005
		});
		
		
   	},
   	methods: {
   		goBack: function(){
			this.$router.back(-1);
		}
   	}
}
</script>
<style lang="scss">
#classList{
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