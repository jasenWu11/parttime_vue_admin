<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '详情'"
    :close-on-click-modal="false"
    :modal-append-to-body='false'
    :visible.sync="visible">
  
   <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      
			<el-form-item label="行业名称" prop="name">
			  <el-input v-model="dataForm.name" placeholder="行业名称"></el-input>
			</el-form-item>
			<el-form-item label="行业简介" prop="details">
			  <el-input type="textarea" :rows="2" 
					v-model="dataForm.details"
					placeholder="行业简介">
				</el-input>
			</el-form-item>
			<el-form-item label="性格类型" prop="characterCode">
				<!-- <el-input v-model="dataForm.professionName" placeholder="行业名称"></el-input> -->
				<el-select v-model="dataForm.characterCode" 
						placeholder="请选择"
						filterable
						clearable
						@change="selectChanged"
						value-key="id">
					<el-option v-for="item in characterList" 
						:key="item.id" 
						:label="item.name" 
						:value="item.code">
						<span style="float: left">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
					</el-option>
				</el-select>
			</el-form-item>
      <el-form-item v-if="dataForm.id" label="创建时间" prop="applyTime">
        <el-input v-model="dataForm.createTime" disabled type="text" placeholder="创建时间"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandle()">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getInfo, update, add } from '@/api/profession'
import { getList } from '@/api/character'
/* eslint-disable */
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          userName: '',
					fileName: '',
        },
				characterList: [],
        dataRule: {
					name: [
					  { required: true, message: '不能为空', trigger: 'blur' }
					],
					details: [
					  { required: true, message: '不能为空', trigger: 'blur' }
					],
        }
      }
    },
		created() {
			this.getList()
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
			
			
			getList() {
				getList(1, 500, null).then(response => {
					if (response.status === 0) {
						this.characterList = response.data.records
						if(response.data.current == 1){
							this.formData.pageIndex = 1
						}
						// this.totalPage = response.data.total
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
			
			
			selectChanged(val){
				// console.log("changge" + val)
				this.dataForm.characterCode = val;
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
			  this.fileList = [];
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
