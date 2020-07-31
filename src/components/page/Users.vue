<template>
  <div>
		<div class="crumbs">
		    <el-breadcrumb separator="/">
					<el-breadcrumb-item>
					    <i class="el-icon-user"></i> 用户
					</el-breadcrumb-item>
					<el-breadcrumb-item>普通用户</el-breadcrumb-item>
		    </el-breadcrumb>
		</div>
		
    <div class="container">
			<el-form :inline="true" :model="dataForm" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="dataForm.key" @keyup.enter.native="getUserList()"  placeholder="用户昵称查询" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="getUserList()">查询</el-button>
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
					prop="realName"
					align="center"
					:show-overflow-tooltip="true"
					label="真是姓名">
						<template slot-scope="scope">
							<p>{{scope.row.realName | formatStatus}}</p>
						</template>
				</el-table-column>
				<el-table-column
					prop="userName"
					align="center"
					:show-overflow-tooltip="true"
					label="用户名">
				</el-table-column>
				<el-table-column
					prop="phone"
					align="center"
					:show-overflow-tooltip="true"
					label="电话">
				</el-table-column>
				<el-table-column
					prop="city"
					align="center"
					:show-overflow-tooltip="true"
					label="城市">
				</el-table-column>
				<el-table-column
					prop="email"
					align="center"
					:show-overflow-tooltip="true"
					label="邮箱">
				</el-table-column>
				<el-table-column
					prop="sex"
					align="center"
					:show-overflow-tooltip="true"
					label="性别">
					<template slot-scope="scope">
						<p>{{scope.row.sex | formatSex}}</p>
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
						<el-button type="warning" size="small" @click="resetPassword(scope.row.id)">密码</el-button>
						<el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getUserList"></add-or-update>
  </div>
</template>

<script>
 /* eslint-disable */
// api引入
import { getUserList } from '@/api/user'

import AddOrUpdate from './user-add-or-update'
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
    this.getUserList()
  },
	filters:{
		formatStatus(val){
			return (val == '' || val == null) ? '--' : val;
		},
		formatSex(val){
			return val == null ? '--' : val === 1? '男' : '女';
		}
	},
  methods: {

    getUserList () {
      getUserList(this.pageIndex, this.pageSize, this.dataForm.key, 0).then(response => {
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
	  this.getUserList()
	},
	// 当前页
	currentChangeHandle (val) {
	  this.pageIndex = val;
	  this.getUserList()
	},
	// 多选
	selectionChangeHandle (val) {
	  this.dataListSelections = val
	},
	// 新增 / 修改
	addOrUpdateHandle (id) {
	  this.addOrUpdateVisible = true
	  this.$nextTick(() => {
	   this.$refs.addOrUpdate.init(id,false)
	  })
	},

  //重置密码
  resetPassword(id){
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
     this.$refs.addOrUpdate.init(id,true)
    })
  },
	
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
