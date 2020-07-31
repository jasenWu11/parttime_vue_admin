import Vue from 'vue';
import Router from 'vue-router';

import Users from '@/components/page/Users'
import Companys from '@/components/page/Companys'
import Complaint from '@/components/page/Complaint'
import Cv from '@/components/page/Cv'
import ApplyJob from '@/components/page/ApplyJob'
import Profession from '@/components/page/Profession'
import Job from '@/components/page/Job'
import Question from '@/components/page/characterTest/Question'
import QuestionEdit from '@/components/page/characterTest/QuestionEdit'
import cTest from '@/components/page/characterTest/cTest'
import Advert from '@/components/page/advert/Advert'
import Character from '@/components/page/Character'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
								{
								  path: '/users',
								  name: 'users',
								  component: Users,
								  meta: { title: '普通用户' }
								},
								{
								  path: '/companys',
								  name: 'companys',
								  component: Companys,
								  meta: { title: '企业用户' }
								},
								{
								  path: '/complaint',
								  name: 'complaint',
								  component: Complaint,
								  meta: { title: '投诉建议' }
								},
								{
								  path: '/cv',
								  name: 'cv',
								  component: Cv,
								  meta: { title: '简历管理' }
								},
								{
								  path: '/applyjob',
								  name: 'applyjob',
								  component: ApplyJob,
								  meta: { title: '应聘管理' }
								},
								{
								  path: '/profession',
								  name: 'profession',
								  component: Profession,
								  meta: { title: '行业管理' }
								},
								{
								  path: '/job',
								  name: 'job',
								  component: Job,
								  meta: { title: '招聘管理' }
								},
								{
								  path: '/question',
								  name: 'question',
								  component: cTest,
								  meta: { title: '问卷管理' }
								},
								{
								  path: '/question_add',
								  name: 'add',
								  component: Question,
								  meta: { title: '新增试题' }
								},
								{
								  path: '/question_edit',
								  name: 'question_edit',
								  component: QuestionEdit,
								  meta: { title: '编辑试题' }
								},
								{
								  path: '/character',
								  name: 'character',
								  component: Character,
								  meta: { title: '性格管理' }
								},
								
							
								{
								  path: '/advert',
								  name: 'advert',
								  component: Advert,
								  meta: { title: '广告管理' }
								},
								
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const LOGINURL = '/login'
  let url, user

  url = to.path
	// console.log(to)
	// console.log(url)
  user = sessionStorage.getItem('user')

  if (url === LOGINURL) {
    sessionStorage.removeItem('user')
  }

  // 判断是否登录
  if (!user && url !== LOGINURL) {
    next({ path: LOGINURL })
  } else {
    next()
  }
})


export default router