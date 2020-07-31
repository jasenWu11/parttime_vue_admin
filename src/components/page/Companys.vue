<template>
  <div>
		<div class="crumbs">
		    <el-breadcrumb separator="/">
					<el-breadcrumb-item>
					    <i class="el-icon-user"></i> 用户
					</el-breadcrumb-item>
					<el-breadcrumb-item>企业用户</el-breadcrumb-item>
		    </el-breadcrumb>
		</div>
		
    <div class="container">
			<el-form :inline="true" :model="dataForm" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="dataForm.key" @keyup.enter.native="getList()"  placeholder="用户/企业名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
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
					prop="userName"
					align="center"
					:show-overflow-tooltip="true"
					label="用户名">
				</el-table-column>

				<el-table-column
					prop="cname"
					align="center"
					:show-overflow-tooltip="true"
					label="企业名称">
				</el-table-column>
				<el-table-column
					prop="phone"
					align="center"
					:show-overflow-tooltip="true"
					label="电话">
				</el-table-column>

				<el-table-column
					prop="email"
					align="center"
					:show-overflow-tooltip="true"
					label="邮箱">
				</el-table-column>
				<el-table-column
					prop="address"
					align="center"
					:show-overflow-tooltip="true"
					label="地址">
					<template slot-scope="scope">
						<p>{{scope.row.address | formatStatus}}</p>
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
				  prop="verify"
				  :min-width="100"
				  align="center"
				  label="企业审核">
				  <template slot-scope="scope">
				    <el-tooltip :content="getStatus(scope.row.verify)" placement="top">
							<el-switch
								:active-value="true"
								:inactive-value="false"
								active-color="#13ce66"
								inactive-color="#DCDFE6"
								v-model="scope.row.verify"
								@change="toVerify(scope.row)">
							</el-switch>
				    </el-tooltip>
				  </template>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
  </div>
</template>

<script>
 /* eslint-disable */
// api引入
import { getList,update } from '@/api/companys'

import AddOrUpdate from './companys-add-or-update'
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
		},
		formatSex(val){
			return val == null ? '--' : val === 1? '男' : '女';
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
	
	getStatus (val) {
		return val? '通过' : '不通过';
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
	// 删除
	deleteHandle (id) {
		// console.log(id)
	},


	toVerify(obj){
		if (!obj.id) {
			return false;
		}
		update(obj).then(response => {
        if (response.status === 0) {
					this.getList();
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
           this.$message.error(response.data.msg)
        }
      }).catch(response => {
        // this.loading = false
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
