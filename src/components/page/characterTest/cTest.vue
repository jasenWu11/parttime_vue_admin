<template>
  <div>
		<div class="crumbs">
		    <el-breadcrumb separator="/">
					<el-breadcrumb-item>
					    <i class="el-icon-edit-outline"></i> 问卷管理
					</el-breadcrumb-item>
					<!-- <el-breadcrumb-item>企业用户</el-breadcrumb-item> -->
		    </el-breadcrumb>
		</div>
		
    <div class="container">
			<el-form :inline="true" :model="dataForm" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="dataForm.key" 
						@keyup.enter.native="getList()"  
						placeholder="标题" 
						clearable>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
					<el-button type="success" icon="el-icon-circle-plus-outline" @click="addHandle()">新增</el-button>
					<el-button  type="danger"
						@click="deleteHandle()" 
						:disabled="dataListSelections.length <= 0">批量删除
					</el-button>
				</el-form-item>
			</el-form>
	
			<el-table
				:data="dataList"
				border
				class="table"
				align="center"
				v-loading="dataListLoading"
				@selection-change="selectionChangeHandle"
				>
				<el-table-column
				  type="selection"
				  align="center"
				  width="50">
				</el-table-column>
				<el-table-column
				 prop="item" 
				 :width="50"
				 type="expand"
				 label="选项">
					<template slot-scope="scope">
						<el-form label-position="left" class="demo-table-expand">
							<el-form-item 
								v-for="(val, index) in JSON.parse(scope.row.item)" :key="index"
								:label="`选项${index + 1}`">
								<!-- <el-input v-model="val.value" readonly >
								</el-input> -->
								<el-row>
									<el-col :span="12">
										<el-input type="textarea" v-model="val.value" :rows="1" readonly placeholder="请输入答案" />
									</el-col>
									<el-col :span="2">
										<span class="positonRe">分数</span> 
									</el-col>
									<el-col :span="3">
										<el-input v-model="val.grade" readonly placeholder="" />
									</el-col>
									<el-col :span="2">
										<span class="positonRe">性格颜色</span> 
									</el-col>
									<el-col :span="2">
										<el-tag
											:type="val.colors == 'red'? 'danger'
												: val.colors == 'blue' ? 'primary'
												: val.colors == 'green' ?'success' : 'warning'">
												{{ val.colors | formatColors }}
										</el-tag>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column
					prop="title"
					align="center"
					:min-width="150"
					:show-overflow-tooltip="true"
					label="标题">
				</el-table-column>
				<el-table-column
					prop="createTime"
					align="center"
					:show-overflow-tooltip="true"
					label="创建日期">
				</el-table-column>
				<el-table-column
					prop="multiple"
					align="center"
					:show-overflow-tooltip="true"
					label="题目类型">
					<template slot-scope="scope">
						 <el-tag
								:type="scope.row.multiple == 0 ? 'primary' : 'success'"
								disable-transitions>{{scope.row.multiple | formatStatus}}
							</el-tag>
						<!-- <p>{{scope.row.multiple | formatStatus}}</p> -->
					</template>
				</el-table-column>	
				
				<el-table-column
					fixed="right"
					align="center"
					width="150"
					label="操作">
					<template slot-scope="scope">
						<!-- <el-button type="warning" size="small" @click="resetPassword(scope.row.id)">密码</el-button> -->
						<el-button type="primary" size="small" @click="editHandle(scope.row.id)">编辑</el-button>
						<el-button type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
				:current-page="pageIndex"
				:page-sizes="[5, 10, 20, 50, 100]"
				:page-size="pageSize"
				:total="totalPage"
				layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
  </div>
</template>

<script>
 /* eslint-disable */
// api引入
import { getList, deleteList} from '@/api/question'
import bus from '@/components/common/bus';
import AddOrUpdate from './ctest-add-or-update'
export default {
  data () {
    return {
	   dataForm: {
		  key: ''
	   },
		 tableHeight: window.innerHeight - 200,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
			dataListSelections: [],
			addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    // this.getArticles()
  },
  created () {
    this.getList()
  },
	filters:{
		formatStatus(val){
			return val == 1 ? '多选' : '单选';
		},
		formatColors(val){
			return val == 'red' ? '红色' : val == 'blue' ? '蓝色' : val == 'green' ? '绿色' : '黄色';
		}
	},
  methods: {

    getList () {
      getList(this.pageIndex, this.pageSize, this.dataForm.key).then(response => {
        if (response.status === 0) {
           this.dataList = response.data.records
					 this.totalPage = response.data.total
        } else {
          this.$message({
            type: 'error',
            message: '获取失败!'
          })
        }
      }).catch(response => {
        // this.loading = false
    })
  },
	

	// 每页数
	sizeChangeHandle (val) {
	  this.pageSize = val;
	  this.pageIndex = 1;
	  this.getList()
	},
	// 当前页
	currentChangeHandle (val) {
	  this.pageIndex = val;
	  this.getList()
	},
	// 多选
	selectionChangeHandle (val) {
	  this.dataListSelections = val
	},
	// 新增 / 修改
	addHandle (id) {
		this.$router.push({ path: '/question_add'})
	},
	
	editHandle (id) {
		bus.$emit('isExistPath', '编辑试题');
		this.$router.replace({ path: '/question_edit', query: { questionId: id }})
	},
	

	// 删除
	deleteHandle (id) {
		var ids = id ? [id]: this.dataListSelections.map(item => {
		  return item.id
		})
		this.$confirm(`确定删除?`, '提示', {
			 confirmButtonText: '确定',
			 cancelButtonText: '取消',
			 type: 'warning'
		 }).then(() => {
				this.toDelete(ids)
		})
	},
	
	// filterTag(value, row) {
	// 	console.log('value-' + value  + "-----" + row )
	// 	return row.multiple === value;
	// },
	
	toDelete(ids){
		deleteList(ids).then(response => {
			if (response.status === 0) {
				 this.getList();
				 this.$message({
					 type: 'success',
					 message: '删除成功'
				 })
			} else {
				this.$message({
					type: 'error',
					message: '删除失败!'
				})
			}
		})
	}

  }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.green {
    color: #67C23A;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.positonRe{
	/* position: relative; */
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-right: 10px;
	/* right: 5%; */
}
</style>
