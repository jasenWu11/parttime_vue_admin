<template>
  <div>
		<div class="crumbs">
		    <el-breadcrumb separator="/">
					<el-breadcrumb-item>
					    <i class="el-icon-document-copy"></i> 简历管理
					</el-breadcrumb-item>
					<!-- <el-breadcrumb-item>企业用户</el-breadcrumb-item> -->
		    </el-breadcrumb>
		</div>
		
    <div class="container">
			<el-form :inline="true" :model="dataForm" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="dataForm.key" 
						@keyup.enter.native="getList()"  
						placeholder="用户名" 
						clearable>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
					<!-- <el-button  type="danger"
						@click="deleteHandle()" 
						:disabled="dataListSelections.length <= 0">批量删除
					</el-button> -->
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
			<!-- 	<el-table-column
				  type="selection"
				  align="center"
				  width="50">
				</el-table-column> -->
				<el-table-column
					prop="userName"
					align="center"
					:show-overflow-tooltip="true"
					label="所属用户">
				</el-table-column>
				<el-table-column
					prop="fileId"
					align="center"
					:min-width="150"
					:show-overflow-tooltip="true"
					label="分组位置">
				</el-table-column>

				<el-table-column
					prop="fileName"
					align="center"
					:show-overflow-tooltip="true"
					label="简历名称">
				</el-table-column>

				<el-table-column
					prop="createTime"
					align="center"
					:min-width="80"
					:show-overflow-tooltip="true"
					label="更新时间">
				</el-table-column>

	
				<el-table-column
					fixed="right"
					align="center"
					:min-width="100"
					label="操作">
					<template slot-scope="scope">
						<!-- <el-button type="warning" size="small" @click="resetPassword(scope.row.id)">密码</el-button> -->
						
						<el-button type="primary" size="small" @click="watchFile(scope.row)">预览</el-button>
						<!-- <el-button type="primary" size="small" @click="downloadFile(scope.row)">导出</el-button> -->
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
    <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update> -->
  </div>
</template>

<script>
 /* eslint-disable */
// api引入
import { getList, deleteById, download} from '@/api/cv'

// import AddOrUpdate from './complaint-add-or-update'
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
    // AddOrUpdate
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
            message: response.msg
          })
        }
      }).catch(response => {
        // this.loading = false
    })
  },
	
	download(id) {
	    let a = document.createElement('a')
	    a.href ="cv/download?id=" + id;
	    a.click();
	}, 
	
	watchFile(obj){
		  var url = obj.paths + obj.fileId;
			window.open(url);
	},
	
	downloadFile (obj) {
		if (!obj.id) {
			return false;
		} 

		download(obj.id).then(response => {
			console.log('response----------')
			console.log(response)
			//that is not friendly
			let url = window.URL.createObjectURL(new Blob([response]));
			// let url = window.URL.createObjectURL(new Blob([response]))
			let link = document.createElement('a');
			link.style.display = 'none'
			link.href = url
			console.log('url----------' + url)
			link.setAttribute('download', obj.fileName)
			document.body.appendChild(link)
			link.click()
	
			document.body.removeChild(link); //下载完成移除元素
			window.URL.revokeObjectURL(url); //释放掉blob对象
		
    }).catch(response => {
				console.log('在catch 中');
				if(!response){
					this.$message({
					  type: 'error',
					  message: '下载文件异常，文件不存在 或 数据库中不存在'
					})
				}		
			});
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
	deleteHandle (id) {
		this.$confirm(`确定删除?`, '提示', {
			 confirmButtonText: '确定',
			 cancelButtonText: '取消',
			 type: 'warning'
		 }).then(() => {
				this.toDelete(id)
		})
	},
	
	toDelete(id){
		deleteById(id).then(response => {
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