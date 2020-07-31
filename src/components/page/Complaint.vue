<template>
  <div>
		<div class="crumbs">
		    <el-breadcrumb separator="/">
					<el-breadcrumb-item>
					    <i class="el-icon-s-comment"></i> 投诉建议
					</el-breadcrumb-item>
					<!-- <el-breadcrumb-item>企业用户</el-breadcrumb-item> -->
		    </el-breadcrumb>
		</div>
		
    <div class="container">
			<el-form :inline="true" :model="dataForm" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="dataForm.key" 
						@keyup.enter.native="getList()"  
						placeholder="投诉内容" 
						clearable>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
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
					prop="details"
					align="center"
					:min-width="200"
					:show-overflow-tooltip="true"
					label="内容">
				</el-table-column>
				<el-table-column
					prop="phone"
					align="center"
					:show-overflow-tooltip="true"
					label="电话">
					<template slot-scope="scope">
						<p>{{scope.row.phone | formatStatus}}</p>
					</template>
				</el-table-column>

				<el-table-column
					prop="email"
					align="center"
					:show-overflow-tooltip="true"
					label="邮箱">
					<template slot-scope="scope">
						<p>{{scope.row.email | formatStatus}}</p>
					</template>
				</el-table-column>

				<el-table-column
					prop="createTime"
					align="center"
					:min-width="100"
					:show-overflow-tooltip="true"
					label="创建时间">
				</el-table-column>

	
				<el-table-column
					fixed="right"
					align="center"
					width="150"
					label="操作">
					<template slot-scope="scope">
						<!-- <el-button type="warning" size="small" @click="resetPassword(scope.row.id)">密码</el-button> -->
						<el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">详情</el-button>
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
import { getList, deleteList} from '@/api/complaint'

import AddOrUpdate from './complaint-add-or-update'
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
			return (val == '' || val == null) ? '--' : val;
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
	addOrUpdateHandle (id) {
	  this.addOrUpdateVisible = true
	  this.$nextTick(() => {
	   this.$refs.addOrUpdate.init(id)
	  })
	},

	// 删除
	// 删除
	deleteHandle (id) {
		var ids = id ? [id]: this.dataListSelections.map(item => {
		   return item.id
		 })
		 if (ids.length > 1) {
				this.$confirm(`确定进行批量删除操作?`, '提示', {
				   confirmButtonText: '确定',
				   cancelButtonText: '取消',
				   type: 'warning'
				 }).then(() => {
						this.toDelete(ids)
				})
		 } else{
				this.toDelete(ids)
		 }
	},
	
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
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
