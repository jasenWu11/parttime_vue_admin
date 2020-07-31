<template>
	
  <div>
		<div class="crumbs">
		    <el-breadcrumb separator="/">
					<el-breadcrumb-item>
					    <i class="el-icon-edit-outline"></i> 广告管理
					</el-breadcrumb-item>
					<!-- <el-breadcrumb-item>企业用户</el-breadcrumb-item> -->
		    </el-breadcrumb>
		</div>
		
    <div class="container">
			<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
				<el-form-item>
					<el-input v-model="dataForm.key" placeholder="查询广告标题" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDataList()">查询</el-button>
					<el-button type="success" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()">新增</el-button>
					<el-button  type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
				</el-form-item>
			</el-form>
			<div class="m-box">
				<el-table
					:data="dataList"
					border
					min-height="200px"
					align="center"
					v-loading="dataListLoading"
					@selection-change="selectionChangeHandle"
					style="width: 100%;">
				 <el-table-column
				   type="selection"
				   align="center"
				   width="50">
				 </el-table-column>
				
					<el-table-column
						prop="title"
						align="center"
						min-width="150"
						:show-overflow-tooltip="true"
						label="广告标题">
					</el-table-column>
					<el-table-column
						prop="photo"
						align="center"
						min-width="150"
						:show-overflow-tooltip="true"
						label="广告图片">
						<template slot-scope="scope">
							<el-popover
								placement="right"
								title=""
								trigger="click">
								<el-image slot="reference" :src="scope.row.photo"
									:alt="scope.row.photo"
									style="width:100px; height:60px;"></el-image>
								<el-image :src="scope.row.photo"></el-image>
							</el-popover>
							<!-- <img :src="scope.row.advertimage" width="100" height="60" class="head_pic"/> -->
						</template>
					</el-table-column>
					<el-table-column
						 prop="urls"
						 align="center"
						 :show-overflow-tooltip="true"
						 label="链接">
					 </el-table-column>
					 
					 <el-table-column
							prop="details"
							align="center"
							:show-overflow-tooltip="true"
							label="内容">
						</el-table-column>
					 
					<el-table-column
						prop="createTime"
						align="center"
						min-width="150"
						:show-overflow-tooltip="true"
						label="创建时间">
					</el-table-column>
				 <!-- <el-table-column
						fixed="right"
						prop="disabled"
						align="center"
						label="是否启动">
					<template slot-scope="scope">
						<el-switch
							:active-value="false"
							:inactive-value="true"
							active-color="#13ce66"
							inactive-color="#909399"
							v-model="scope.row.disabled"
							@change="updateEnabled(scope.row)">
						</el-switch>
					</template>
					</el-table-column> -->
					<el-table-column
						fixed="right"
						align="center"
						width="150"
						label="操作">
						<template slot-scope="scope">
							<el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
							<el-button type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					@size-change="sizeChangeHandle"
					@current-change="currentChangeHandle"
					:current-page="pageIndex"
					:page-sizes="[10, 20, 50, 100]"
					:page-size="pageSize"
					:total="totalPage"
					layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
/* eslint-disable */
	import { getAdvertList, updateAdvert, deleteList } from '@/api/advert'
  import AddOrUpdate from './advert-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          disabled: null
        },
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
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        getAdvertList(this.pageIndex, this.pageSize, this.dataForm.key,this.dataForm.disabled).then(response => {
          if (response.status === 0) {
             this.dataList = response.data.records
        		 this.totalPage = response.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
					this.dataListLoading = false
        }).catch(response => {
					// this.loading = false
				})

      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteList(ids).then(response => {
            if (response.status === 0) {
              this.getDataList();
              this.$message({
                type: 'success',
                message: '操作成功'
              })
            } else {
              this.$message.error(response.msg)
            }
          })
        })
      },

			//修改启动状态
			updateEnabled(obj){
				if (!obj.id) {
					return false;
				}
        updateAdvert(obj).then(response => {
          if (response.status === 0) {
            this.getDataList();
            this.$message({
              type: 'success',
              message: '操作成功'
            })
        } else {
          this.$message.error(response.msg)
        }
      })
		},

  }
}
</script>
