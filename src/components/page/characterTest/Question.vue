
<template>
  <div class="hello">
		<div class="crumbs">
		    <el-breadcrumb separator="/">
					<el-breadcrumb-item>
					    <i class="el-icon-edit-outline"></i> 问卷管理
					</el-breadcrumb-item>
					<el-breadcrumb-item>新增题目</el-breadcrumb-item>
		    </el-breadcrumb>
		</div>
		
    <el-form ref="modelForm" :rule="rules" :model="modelForm" label-position="right" label-width="100px">
      <vuedraggable v-model="modelForm.topic" class="wrapper" @end="end">
        <div v-for="(item, index) in modelForm.topic" :key="index">
				<!-- <div v-for="(item, index) in modelForm.topic" :key="index"> -->
          <el-collapse v-model="index">
            <el-collapse-item :name="index">
              <template slot="title">
                <span class="Title">	第{{ index+1 }}题</span> 
								<span class="Title">|</span> 
								<span class="Title"> 题目:{{ item.title }}</span> 
              </template>
              <!-- 问题 -->
              <el-form-item
                :prop="`topic.${index}.type`"
                :label="`问题${index + 1}类型`"
                :rules="{ required: true, message: '请选择问题类型', trigger: 'change' }"
              >
                <el-radio-group v-model="item.type">
                  <el-radio :label="0">单选题</el-radio>
                  <el-radio :label="1">多选题</el-radio>
                  <!-- <el-radio :label="2">填空题</el-radio> -->
                </el-radio-group>
              </el-form-item>
              <!--              //问题-->
              <el-form-item
                :prop="`topic.${index}.title`"
                label="问题"
                :rules="{ required: true, message: '请填写问题', trigger: 'change' }" >
								<el-row>
									<el-col :span="12">
										<el-input type="textarea" :rows="1" v-model="item.title" clearable placeholder="请填写问题" />
									</el-col>
								</el-row>	
              </el-form-item>
							
              <!-- 答案 -->
              <el-form-item
                v-for="(opt, idx) in item.answers"
                v-show="item.type!=2"
                :key="idx"
                :label="`选项${idx + 1}`"
                :prop="`topic.${index}.answers.${idx}.value`"
                :rules="[
                  { required: true, message: '请输入答案', trigger: 'blur' },
									{ required: true, message: '请输入分数', trigger: 'blur' },
                ]" >
								<el-row>
									<el-col :span="10">
										<el-input type="textarea" :rows="1" v-model="opt.value" clearable placeholder="请输入答案" />
									</el-col>
									<el-col :span="5">
										<el-form-item
										  :prop="`topic.${index}.answers.${idx}.grade`"
										  label="分数"
										  :rules="{ required: true, message: '请输入分数', trigger: 'change' }"
										>
										<el-input type="number" v-model.trim="opt.grade" placeholder="输入分数" />
										</el-form-item>
									</el-col>
	
									<el-col :span="5">
										<el-form-item
										  :prop="`topic.${index}.answers.${idx}.colors`"
										  label="性格颜色"
										  :rules="{ required: true, message: '请选择颜色', trigger: 'change' }">
											<el-select v-model="opt.colors"	
													placeholder="请选择"
													filterable
													@change="selectChanged">
												<el-option v-for="col_item in colorList" 
													:key="col_item.value" 
													:label="col_item.label" 
													:value="col_item.value">
													 <span style="float: left">{{ col_item.label }}</span>
													 <span style="float: right; color: #8492a6; font-size: 13px">{{ col_item.value }}</span>
												</el-option>
											</el-select>
										</el-form-item>
									</el-col>
									
									<el-col :span="2">
										<el-button style="margin-left: 20px" @click.prevent="removeDomain(index,idx)">删除</el-button>
									</el-col>
								</el-row>
              </el-form-item>
							
              <el-form-item>
                <el-button class="m-L10" v-show="item.type!=2" @click="addDomain(index)">新增选项</el-button>
                <el-button @click="removeQuestion(index)">删除题目</el-button>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </div>
      </vuedraggable>
      <el-form-item>
        <el-button class="m-L10" type="success" @click="addQuestion">新增题目</el-button>
        <el-button type="primary" style="margin-top: 10px" @click="addSubmit()">提交</el-button>
        <el-button type="danger" @click="resetForm('modelForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
 
</template>
<script>
import bus from '@/components/common/bus';
import { getInfo, add } from '@/api/question'
import vuedraggable from 'vuedraggable'
export default {
  name: 'HelloWorld',
  components: {
    vuedraggable
  },
  data() {
    return {
      rules: {},
			activeNames: ['1'],
			questionId: '', 
			colorList: [
				{label: '黄色', value: 'yellow'},
				{label: '蓝色', value: 'blue'},
				{label: '绿色', value: 'green'},
				{label: '红色', value: 'red'}
			],
      modelForm: {
        topic: [
					{
						id: '',
						type: '',
						title: '',
						answers: [{ value: '', grade: '', colors:''}]
					},
					// {
					// 	type: '',
					// 	questionName: '',
					// 	answers: [{ value: '' }]
					// },
				]
      }
    }
  },
	created(){
		//this.modelForm.topic.id = this.$route.query.questionId;
		this.init (this.$route.query.questionId);
	},
	
  methods: {
		
		init (id){
			if(!id){
				return false;
			}else{
				getInfo(id).then(response => {
					if (response.status === 0) {
						var data = response.data;
						// console.log(data);
						this.modelForm.topic[0].id = data.id;
						this.modelForm.topic[0].type = data.multiple;
						this.modelForm.topic[0].title = data.title;
						this.modelForm.topic[0].answers = JSON.parse(data.item);
						console.log(this.modelForm)
					} else {
						this.$message.error(response.msg)
					}
				});
				
			}
			
		},
		
		selectChanged(val){
			// this.dataForm.code = val;
			// console.log(val)
			// let obj = {};
			// obj = this.colorList.find((item)=>{//这里的userList就是上面遍历的数据源
			// 		return item.value === val;//筛选出匹配数据
			// });
			// if(obj.label){
			// 	this.dataForm.name = obj.label
			// }
		},
		
    end(evt) {
      this.$refs.modelForm.clearValidate()
    },
    removeDomain(index, idx) { // 删除选项
      this.modelForm.topic[index].answers.splice(idx, 1)
    },
    removeQuestion(index) {//删除题目
      this.modelForm.topic.splice(index, 1)
    },
    addDomain(index) { // 新增选项
      this.modelForm.topic[index].answers.push({ value: '' })
    },
    addQuestion() { // 新增题目
      this.modelForm.topic.push({ id: '', type: '', title: '', answers: [{ value: '',grade: '' }] })
    },
    resetForm(formName) { // 重置
      this.$refs[formName].resetFields()
    },
    addSubmit() {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
					var obj = this.modelForm.topic;
					var list = []
					for (let i in obj) {
							var temp = {};
							temp.id = obj[i].id;
							temp.title = obj[i].title;
							temp.item = JSON.stringify(obj[i].answers);
							temp.multiple = obj[i].type;
							list.push(temp);
					}
					add(list).then(response => {
						if (response.status === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
							})
							// //清空表单
							// this.resetForm('modelForm');
							// //初始化数据
							// this.modelForm.topic = [
							// 	{
							// 		id: '',
							// 		type: '',
							// 		title: '',
							// 		answers: [{ value: '', grade: ''}]
							// 	},
							// ]
							// this.$router.push({ path: '/question' })
							bus.$emit('closeTag', this.$route.fullPath);
						} else {
							this.$message.error(response.msg)
						}
					});
        }
      })
    }
  }
}
</script>

<style scoped> 
	.Title{
		margin-left: 5px;
	}
	.m-LR20{
		margin-left: 20px;
		margin-right: 10px;;
	}
	.positonRe{
		/* position: relative; */
		display: flex;
		justify-content: flex-end;
		align-items: center;
		/* right: 5%; */
	}
	.m-L20{
		margin-left: 20px;
	}
	.m-L10{
		margin-left: 10px;
	}
</style>