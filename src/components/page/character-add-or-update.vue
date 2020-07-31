<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '详情'"
    :close-on-click-modal="false"
    :modal-append-to-body='false'
		@close="closeHandle()"
    :visible.sync="visible">
  
   <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      
			
		<!-- 	<el-form-item label="性格编码" prop="code">
			  <el-input v-if=""
					v-model="dataForm.code" 
					:disabled="dataForm.id == 0 ? false : true"
					placeholder="性格编码">
				</el-input>
			</el-form-item> -->
			<!-- disabled -->
			<el-form-item label="性格类型" prop="code">
				<!-- <el-input v-model="dataForm.professionName" placeholder="行业名称"></el-input> -->
				<el-select v-model="dataForm.code"
						:disabled="dataForm.id == 0 ? false : true"
						placeholder="请选择"
						filterable
						clearable
						@change="selectChanged"
						value-key="id">
					<el-option v-for="item in colorList" 
						:key="item.value" 
						:label="item.label" 
						:value="item.value">
						 <span style="float: left">{{ item.label }}</span>
						 <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			
			<el-form-item label="性格名称" prop="name">
			  <el-input v-model="dataForm.name" placeholder="性格名称"></el-input>
			</el-form-item>
			
			<el-form-item label="性格介绍" prop="content">
			  <el-input type="textarea" 
					:rows="3" 
					v-model="dataForm.content"
					placeholder="行业简介">
				</el-input>
			</el-form-item>
      <el-form-item v-if="dataForm.id" readonly label="创建时间" prop="applyTime">
        <el-input v-model="dataForm.createTime" disabled type="text" placeholder="创建时间"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getInfo, update, add } from '@/api/character'
// import { getList } from '@/api/profession'
/* eslint-disable */
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          code: '',
					name: '',
        },
				colorList: [
					{label: '蓝 + 绿', value: 'blue_green'  },
					{label: '蓝 + 红', value: 'blue_red'},
					{label: '蓝 + 黄', value: 'blue_yellow'},
					{label: '绿 + 蓝', value: 'green_blue'  },
					{label: '绿 + 红', value: 'green_red'},
					{label: '绿 + 黄', value: 'green_yellow'},
					{label: '红 + 蓝', value: 'red_blue'},
					{label: '红 + 绿', value: 'red_green'},
					{label: '红 + 黄', value: 'red_yellow'},
					{label: '黄 + 蓝', value: 'yellow_blue'},
					{label: '黄 + 绿', value: 'yellow_green'},
					{label: '黄 + 红', value: 'yellow_red'}
				],
				professionList:[],
        dataRule: {
					name: [
					  { required: true, message: '性格名称不能为空', trigger: 'blur' }
					],
					code: [
					  { required: true, message: '性格编码不能为空', trigger: 'blur' }
					],
					content: [
					  { required: true, message: '性格介绍不能为空', trigger: 'blur' }
					],
        }
      }
    },
	
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true
        if(this.dataForm.id){
					getInfo(this.dataForm.id).then(response => {
						if (response.status === 0) {
							 this.dataForm = response.data
						}else{
               this.visible = false
               this.$message.error(response.msg)
            }
					}).catch(response => {
						 // this.visible = false
					})
				}
      },
			
			selectChanged(val){
				this.dataForm.code = val;
				let obj = {};
				obj = this.colorList.find((item)=>{//这里的userList就是上面遍历的数据源
						return item.value === val;//筛选出匹配数据
				});
				if(obj.label){
					this.dataForm.name = obj.label
				}
				
			},
			
			// 表单提交
			dataFormSubmit () {
			  this.$refs['dataForm'].validate((valid) => {
			    if (valid) {
						if(this.dataForm.id){
							update(this.dataForm).then(response => {
								if (response.status === 0) {
									this.resetForm('dataForm')
									this.$message({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
											this.visible = false
											this.$emit('refreshDataList')
										}
									})
								} else {
										this.$message.error(response.msg)
								}
							});
						}else{
							this.toAdd();
						}
						
			    }
			  })
			},
			
			toAdd(){
				add(this.dataForm).then(response => {
					if (response.status === 0) {
						this.resetForm('dataForm')
						this.$message({
							message: '添加成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
								this.visible = false
								this.$emit('refreshDataList')
							}
						})
					} else {
							this.$message.error(response.msg)
					}
				});
			},
  
      resetForm(formName) {
      	this.visible = false
      	this.$refs[formName].resetFields();
      },
 
			// 弹窗关闭时 取消或右上角x 都会触发
			closeHandle () {
			  this.dataForm = {};
				this.resetForm('dataForm')
			  this.$emit('refreshDataList')
			}

    }
  }
</script>

<style scoped="scoped">

	.andre_avatars {
	  width: 150px;
	  height: 150px;
	  display: block;
	}

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
