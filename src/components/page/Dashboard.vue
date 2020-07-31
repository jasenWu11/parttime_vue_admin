<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
								<el-row :gutter="20" class="mgb20">
								    <el-col :span="24">
								        <el-card shadow="hover" :body-style="{padding: '0px'}">
								            <div class="grid-content grid-con-1">
								                <i class="el-icon-lx-people grid-con-icon"></i>
								                <div class="grid-cont-right">
								                    <div class="grid-num">{{dataFrom.userCount}}</div>
								                    <div>用户总数</div>
								                </div>
								             </div>
								         </el-card>
								    </el-col>
								</el-row>
								<el-row :gutter="20" class="mgb20">
								      <el-col :span="24">
								          <el-card shadow="hover" :body-style="{padding: '0px'}">
								              <div class="grid-content grid-con-2">
								                  <i class="el-icon-office-building grid-con-icon"></i>
								                  <div class="grid-cont-right">
								                      <div class="grid-num">{{dataFrom.companyCount}}</div>
								                      <div>企业总数</div>
								                  </div>
								              </div>
								          </el-card>
								      </el-col>
								</el-row>
									
								<el-row :gutter="20" class="mgb20">
											<el-col :span="24">
									        <el-card shadow="hover" :body-style="{padding: '0px'}">
									            <div class="grid-content grid-con-3">
									                <i class="el-icon-monitor grid-con-icon"></i>
									                <div class="grid-cont-right">
									                    <div class="grid-num">{{dataFrom.jobCount}}</div>
									                    <div>兼职数量</div>
									                </div>
									            </div>
									        </el-card>
									    </el-col>
									</el-row> 
            </el-col>
            <el-col :span="18">
               <el-card shadow="hover" style="height:340px;">
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div id="UserMonth"  class="grid-content" style="height: 280px;"></div>
                    </el-col>
                    <el-col :span="24">
											
                      <div class="dateTimePick">
												<span class="demonstration">年份</span>
												<el-date-picker
													v-model="selectYear"
													value-format="yyyy"
													type="year"
													@change="initUserMonth()"
													placeholder="选择年">
												</el-date-picker>
                      </div>
                    </el-col>
                  </el-row>
               </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <div id="JobMonth"  class="grid-content" style="height: 300px;"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <div id="JobStatistics"  class="grid-content" style="height: 300px;"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import bus from '../common/bus';
import echarts from 'echarts'
import { getStatistics, getUserMonth, getJobMonth, getJobStatistics } from '@/api/statistics'
 
export default {
    name: 'dashboard',
    data() {
			return {
				name: localStorage.getItem('ms_username'),
				dataFrom: {
				  userCount: '',
					companyCount: '',
					jobCount: ''
				},
				selectYear: '',
				fixYear:'',
				userEchartData:[],
				jobEchartData: [],
				apply_Job_Status: ['待审核','审核通过','谢绝申请','取消申请'],
				month:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			}
			
    },
		created() {
			this.init()
			this.selectYear = new Date().getFullYear().toString();
			this.fixYear = new Date().getFullYear().toString();
		},
    components: {
        // Schart
    },
    computed: {
        // role() {
        //     return this.name === 'admin' ? '超级管理员' : '普通用户';
        // }
    },
    methods: {
				init(){
					this.initStatistics();
					this.initUserMonth();
					this.initJobMonth();
					this.initJobStatistics();
				},
				
				initStatistics(){
					getStatistics().then(response => {
						if (response.status === 0) {
							this.dataFrom = response.data
						} else {
							this.$message({
								type: 'error',
								message: '获取概览数据失败!'
							});
						}
					});
				},
				buildData(list) {
					var counts = [];
					var date = this.month;
					var data_length = Object.keys(list).length;
					var set_number = 0;
					for (var i = 0; i < 12; i++) {
						var count = '';
						if (list[date[i]] != undefined) {
							count = list[date[i]];
							set_number++;
						} else {
							if (set_number < data_length) {
								count = 0;
							} else {
								count = null;
							}
						}
						counts.push(count);
					}
				  set_number = 0;
					return counts
				},
				
				initUserMonth() {
					if(this.selectYear == null || this.selectYear.toString().length == 1 || this.selectYear.toString() == ''){
						this.selectYear = new Date().getFullYear().toString();
					}
					getUserMonth(this.selectYear).then(response => {
						if (response.status === 0) {
							this.userEchartData = response.data
							if(this.userEchartData == null || this.userEchartData.length === 0){
								this.userEchartData = [];
								for(var i = 1; i < 12; i++){
									this.userEchartData.push(0);
								}
							}
							this.$nextTick(() => {
							  var title =  this.selectYear + '年用户注册概览';
								var subtext = '月/个';
							  var data = this.buildData(this.userEchartData);
							  this.buildMonthEchart('UserMonth', title, subtext,'个数','line', data);
							});
						} else {
							this.$message({
								type: 'error',
								message: '获取失败!'
							});
						}
					})
				},
				
				initJobMonth(){
					if(this.fixYear == null || this.fixYear.toString() == ''){
						this.fixYear = new Date().getFullYear().toString();
					}
					getJobMonth(this.fixYear).then(response => {
						if (response.status === 0) {
							this.jobEchartData = response.data
							if(this.jobEchartData == null || this.jobEchartData.length === 0){
								this.jobEchartData = [];
								for(var i = 1; i < 12; i++){
									this.jobEchartData.push(0);
								}
							}
							this.$nextTick(() => {
							  var title =  this.fixYear + '年兼职发布概览';
								var subtext = '月/个';
							  var data = this.buildData(this.jobEchartData);
							  this.buildMonthEchart('JobMonth', title, subtext,'个数','bar', data);
							});
						} else {
							this.$message({
								type: 'error',
								message: '获取失败!'
							});
						}
					})
				},
				
				initJobStatistics(){
					getJobStatistics().then(response => {
						if (response.status === 0) {
							var status = response.data
							var list = []
							for(let i in this.apply_Job_Status){
								var temp = {}
								temp.name =  this.apply_Job_Status[i]
								temp.value = status[i]
								list.push(temp)
							}
							this.$nextTick(() => {
							  this.buildJobStatistics('JobStatistics', list);
							});
						} else {
							this.$message({
								type: 'error',
								message: response.msg + '获取职位申请橄榄'
							});
						}
					})
				},
				
				
				buildMonthEchart(id, _title, _subtext,_name,_type, _data) {
					var that = this;
					var char = echarts.init(document.getElementById(id));
					char.setOption({
						title: {
							// text: ( that.selectYear ? that.selectYear :new Date().getFullYear().toString() )+ '年订单交易额',
							text: _title,
				      subtext: _subtext,
							left: 'center'
						},
						tooltip: {
							trigger: 'axis',
							formatter: "{b} 月<br/>{a} : {c}"
						},
				
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: {
							type: 'category',
							// boundaryGap: false,  贴左侧
							data: that.month
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
								itemStyle: {
									normal: {
										color: '#13CE66', //改变折线点的颜色
										lineStyle: {
											color: '#13CE66' //改变折线颜色
										}
									}
								},
								// areaStyle: {normal: {}},
								name: _name,
								type: _type,
								data: _data
							}
						]
					});
				},
				
				buildJobStatistics(id, _data ){
					var that = this;
					var char = echarts.init(document.getElementById(id));
					char.setOption({
							title: {
					        text: '职位申请状态概览',
					        subtext: '状态比例',
					        left: 'center'
					    },
					    tooltip: {
					        trigger: 'item',
					        formatter: '{b} : {c} ({d}%)'
					    },
					    legend: {
					        // orient: 'vertical',
					        // top: 'middle',
					        bottom: 0,
					        left: 'center',
					        data: that.apply_Job_Status
					    },
					    series: [
					        {
					            type: 'pie',
					            radius: '65%',
					            center: ['50%', '50%'],
					            selectedMode: 'single',
					            data: _data,
					            emphasis: {
					                itemStyle: {
					                    shadowBlur: 10,
					                    shadowOffsetX: 0,
					                    shadowColor: 'rgba(0, 0, 0, 0.5)'
					                }
					            }
					        }
					    ],
						});
				},
       
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    /* padding-bottom: 20px; */
 /*   border-bottom: 2px solid #ccc; */
    /* margin-bottom: 20px; */
}

.user-avator {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
.dateTimePick{
	text-align: center;
}
</style>
