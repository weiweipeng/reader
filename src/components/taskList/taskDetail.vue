<template>
	<div id="taskDetail" class="bg-wrap">
		<!--header-->
		<div class="header-title mui-text-center">
			<a class="mui-icon mui-icon-left-nav" @tap="goBack"></a>
			<span>检查作业</span>
		</div>
		<div class="statistics-wrap" v-if="detail">
			<span v-text="'平均分：' + detail.AvgScore.toFixed(1)"></span>
			<span v-text="'完成率：' + detail.DonePercent.toFixed(1)"></span>
			<span v-text="'得分率：' + detail.AvgPercent.toFixed(1)"></span>
			<span class="mui-ellipsis" v-text="'平均用时：' + detail.AvgSpeed.toFixed(1)"></span>
			<span class="mui-ellipsis" v-text="'平均用时：' + detail.AvgTime.toFixed(1)"></span>
		</div>
		<!--列表-->
		<div id="taskScroll" class="mui-scroll-wrapper">
			<div class="mui-scroll">
				<table class="table" v-if="detail && detail.StuDetail.length !== 0">
			        <thead>
			          	<tr>
				            <th>姓名</th>
				            <th>得分</th>
				            <th>得分率</th>
				            <th>用时</th>
				            <th>速度</th>
			          	</tr>
			        </thead>
			        <tbody v-for="item in detail.StuDetail">
			          	<tr v-if="item.IsDone == '0'">
				            <td v-text="item.StudentName"></td>
				            <td>0</td>
				            <td>0%</td>
				            <td>0分钟</td>
				            <td>0词/分</td>
			          	</tr>
			          	<tr v-else>
				            <td v-text="item.StudentName"></td>
				            <td v-text="item.StudentScore"></td>
				            <td v-text="(item.StudentScore * 100 / item.TotalScore).toFixed(0) + '%'"></td>
				            <td v-text="(item.StudentTime / 60).toFixed(0) + '分钟'"></td>
				            <td v-text="(item.Words / (item.StudentTime * 1.0 / 60)).toFixed(0) + '词/分'"></td>
			          	</tr>
			        </tbody>
		      	</table>
			    <h5 class="noBodyDone" v-if="detail && detail.StuDetail.length === 0">暂无学生完成，稍后再来看吧！</h5>
			</div>
		</div>		
				
				
	</div>
</template>

<script>
import store from '@/vuex/store'
export default {
  	name: 'taskDetail',
  	store,
  	data: function(){
      	return {
      		detail: null
      	}
   	},
   	activated: function(){
   		this.detail = null;
   		this.init();
   			
   	},
   	mounted: function() {
   		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005
		});
   	},
   	methods: {
   		init: function(){ 
			var _this = this;;
			var options = {
				Id: _this.$route.query.id
			}
			this.$http.post("http://syapp.keys-edu.com/api/TeacherTask/TeacherTaskStatistic", options).then(function(res){
				console.log(res.body);
				_this.detail = res.body;
			}, function(err){
				console.log(err);
			})
		},
   		goBack: function(){
			this.$router.back(-1);
		}
   	}
}
</script>
<style lang="scss">
#taskDetail{
	.mui-scroll-wrapper{
		top: 3.56rem;
	}
	&.main .mui-scroll-wrapper{
		top: 158px;
	}
	.statistics-wrap{
		padding: 10px;
	}
	.statistics-wrap span{
		background-color: rgb(163, 191, 30);
	    border-radius: 4px;
	    display: inline-block;
	    padding: 8px 0;
	    color: #fff;
	    width: 30.5%;
	    margin: .0 1% 10px;
	    font-size: 10px;
	    line-height: 1;
	    text-align: center;
	}
	.noBodyDone{
		padding: .5rem 0;
	    text-align: center;
	    font-size: .5rem;
	    color: #9fa099;
	}
	/*table*/
	.table {
	    width: 100%;
	}
	.table th {
	    font-weight: 700;
	    position: relative;
	    opacity: .7;
	}
	.table td, .table th {
	    padding: .2rem;
	    vertical-align: top;
	    border-bottom: 1px solid rgba(0, 0, 0, .1);
	    text-align: center;
	}
	.table th:after {
	    position: absolute;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    display: block;
	    content: ' ';
	    background: rgba(163, 191, 30, .3);
	}
}

</style>