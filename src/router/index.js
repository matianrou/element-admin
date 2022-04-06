import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/corplicenseinfo/:id', // 手机扫描二维码访问查看企业信息的h5页面
    component: () => import('@/views/companyInformationH5/index'),
    hidden: true
  },
  {
    path: '/main', // 单点登录页面
    component: () => import('@/components/main'),
    hidden: true
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user',
    children: [
      {
        path: '',
        name: 'user',
        component: () => import('@/views/Authentication/user'),
        meta: { title: '用户管理', icon: 'el-icon-s-custom' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role',
    children: [
      {
        path: '',
        name: 'role',
        component: () => import('@/views/Authentication/role'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/corp/infos',
    component: Layout,
    redirect: '/corp/infos',
    children: [
      {
        path: 'Corp/infos',
        name: 'corp/infos',
        component: () => import('@/views/enterprise/enterMsg'),
        meta: { title: '企业信息管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/menus',
    component: Layout,
    redirect: '/menus',
    children: [
      {
        path: '',
        name: 'menus',
        component: () => import('@/views/meuns/menus'),
        meta: { title: '菜单管理', icon: 'menus' }
      }
    ]
  },
  {
    path: '/corp/annualReport',
    component: Layout,
    redirect: '/corp/annualReport',
    children: [
      {
        path: '',
        name: 'corp/annualReport',
        component: () => import('@/views/annualReport/annualReport'),
        meta: { title: '菜单管理', icon: 'myInfo' }
      }
    ]
  },
  {
    path: '/myInfo',
    component: Layout,
    redirect: '/myInfo',
    children: [
      {
        path: 'myInfo',
        name: 'myInfo',
        component: () => import('@/views/myInfo/myInfo'),
        meta: { title: '菜单管理', icon: 'myInfo' }
      }
    ]
  },
  {
    path: '/license/view',
    component: Layout,
    redirect: '/license/view',
    children: [
      {
        path: 'license/view',
        name: 'license/view',
        component: () => import('@/views/accept/accept'),
        meta: { title: '许可证当前状态查看', icon: 'accept' }
      }
    ]
  },
  {
    path: '/license/accept',
    component: Layout,
    redirect: '/license/accept',
    children: [
      {
        path: 'license/accept',
        name: 'license/accept',
        component: () => import('@/views/acceptance/acceptance'),
        meta: { title: '许可备案申请受理', icon: 'accept' }
      }
    ]
  },
  {
    path: '/license/review',
    component: Layout,
    redirect: '/license/review',
    children: [
      {
        path: 'license/review',
        name: 'license/review',
        component: () => import('@/views/record/record'),
        meta: { title: '许可备案申请审查', icon: 'accept' }
      }
    ]
  },
  {
    path: '/license/unprinted',
    component: Layout,
    redirect: '/license/unprinted',
    children: [
      {
        path: '',
        name: 'license/unprinted',
        component: () => import('@/views/unallow/unallow'),
        meta: { title: '待打印许可备案', icon: 'unallow' }
      }
    ]
  },
  // {
  //   path: '/license/printed',
  //   component: Layout,
  //   redirect: '/license/printed',
  //   children: [{
  //     path: 'license/printed',
  //     name: 'license/printed',
  //     component: () => import('@/views/printed/printed'),
  //     meta: { title: '待打印许可备案', icon: 'unallow' }
  //   }]
  // },
  {
    path: '/tasks/done',
    component: Layout,
    redirect: '/tasks/done',
    children: [
      {
        path: '',
        name: 'tasks/done',
        component: () => import('@/views/tasks/tasks'),
        meta: { title: '已办任务', icon: 'tasks' }
      }
    ]
  },
  {
    path: '/license/quarReport',
    component: Layout,
    children: [
      {
        path: '',
        name: 'license/quarReport',
        component: () => import('@/views/government/quarReport/quarReport'),
        meta: { title: '颁证季报', icon: 'form' }
      }
    ]
  },
  {
    path: '/license',
    component: Layout,
    children: [
      {
        path: '',
        name: 'license',
        component: () => import('@/views/license/license'),
        meta: { title: '许可备案申请', icon: 'license' }
      }
    ]
  },
  {
    path: '/EnterInformation',
    component: Layout,
    children: [
      {
        path: '',
        name: 'EnterInformation',
        component: () => import('@/views/EnterInformation/EnterInformation'),
        meta: { title: '企业基本信息', icon: 'license' }
      }
    ]
  },
  {
    path: '/licenseInformation',
    component: Layout,
    children: [
      {
        path: '',
        name: 'licenseInformation',
        component: () =>
          import('@/views/licenseInformation/licenseInformation'),
        meta: { title: '企业销售管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/productionInformation',
    component: Layout,
    children: [
      {
        path: '',
        name: 'productionInformation',
        component: () =>
          import('@/views/productionInformation/productionInformation'),
        meta: { title: '销售流向管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/Productionpurchasemanagement',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Productionpurchasemanagement',
        component: () =>
          import('@/views/productionInformation/Productionpurchasemanagement'),
        meta: { title: '生产管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/purchasemanage',
    component: Layout,
    children: [
      {
        path: '',
        name: 'purchasemanage',
        component: () => import('@/views/productionInformation/purchasemanage'),
        meta: { title: '购入管理', icon: 'license' }
      }
    ]
  },
  // D:\element-admin\src\views\productionInformation\productionInformation.vue
  {
    path: '/productionInformation',
    component: Layout,
    children: [
      {
        path: '',
        name: 'productionInformation',
        component: () =>
          import('@/views/productionInformation/productionInformation'),
        meta: { title: '销售流向管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/reportyeartongji',
    component: Layout,
    children: [
      {
        path: '',
        name: 'reportyeartongji',
        component: () => import('@/views/reportyeartongji/reportyeartongji'),
        meta: { title: '生产经营统计报表', icon: '' }
      }
    ]
  },
  {
    path: '/putRecord',
    component: Layout,
    children: [
      {
        path: '',
        name: 'putRecord',
        component: () => import('@/views/putRecord/putRecord'),
        meta: { title: '许可备案材料', icon: 'license' }
      }
    ]
  },
  {
    path: '/applicationRecord',
    component: Layout,
    children: [
      {
        path: '',
        name: 'applicationRecord',
        component: () => import('@/views/applicationRecord/index.vue'),
        meta: { title: '许可备案申请', icon: 'license' }
      }
    ]
  },
  {
    path: '/licenserecord',
    component: Layout,
    children: [
      {
        path: '',
        name: 'licenserecord',
        component: () => import('@/views/licenserecord/licenserecord'),
        meta: { title: '许可备案管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/filing',
    component: Layout,
    children: [
      {
        path: '',
        name: 'filing',
        component: () => import('@/views/filing/filing'),
        meta: { title: '申请办证', icon: 'unallow' }
      }
    ]
  },
  {
    path: '/businessCondition',
    component: Layout,
    children: [
      {
        path: '',
        name: 'businessCondition',
        component: () => import('@/views/businessCondition/businessCondition'),
        meta: { title: '易制毒化学品生产经营情况', icon: 'license' }
      }
    ]
  },

  {
    path: '/design',
    component: Layout,
    children: [
      {
        // D:\project\admin-system\element-admin\src\views\activiti\definition\design.vue
        path: '',
        name: 'design',
        component: () => import('@/views/activiti/definition/design'),
        meta: { title: '流程设计', icon: 'license' }
      }
    ]
  },
  {
    path: '/activitiindex',
    component: Layout,
    children: [
      {
        path: '',
        name: 'activitiindex',
        component: () => import('@/views/activiti/definition/index'),
        meta: { title: '流程管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/taskindex',
    component: Layout,
    children: [
      {
        path: '',
        name: 'taskindex',
        component: () => import('@/views/activiti/task/index'),
        meta: { title: 'taskindex', icon: 'license' }
      }
    ]
  },
  {
    path: '/leavevue',
    component: Layout,
    children: [
      {
        path: '',
        name: 'leavevue',
        component: () => import('@/views/workflow/leave/index'),
        meta: { title: '我的申请', icon: 'license' }
      }
    ]
  },
  {
    path: '/leaveAll',
    component: Layout,
    children: [
      {
        path: '',
        name: 'leaveAll',
        component: () => import('@/views/workflow/leave/leaveAll'),
        meta: { title: 'leaveAll', icon: 'license' }
      }
    ]
  },
  {
    path: '/leaveHistoryForm',
    component: Layout,
    children: [
      {
        path: '',
        name: 'leaveHistoryForm',
        component: () => import('@/views/workflow/leave//leaveHistoryForm'),
        meta: { title: '易制毒化学品生产经营情况', icon: 'license' }
      }
    ]
  },
  // -------------------------------------------------------------------------
  {
    path: '/business',
    component: Layout,
    children: [
      {
        path: '',
        name: 'business',
        component: () => import('@/views/government/business/business'),
        meta: { title: '企业管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/enteradmin',
    component: Layout,
    children: [
      {
        path: '',
        name: 'enteradmin',
        component: () => import('@/views/government/enteradmin/enteradmin'),
        meta: { title: '企业管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/chemical',
    component: Layout,
    children: [
      {
        path: '',
        name: 'chemical',
        component: () => import('@/views/government/chemical/chemical'),
        meta: { title: '品种管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/acceptance',
    component: Layout,
    children: [
      {
        path: '',
        name: 'acceptance',
        component: () => import('@/views/government/acceptance/acceptance'),
        meta: { title: '许可备案颁发', icon: 'license' }
      }
    ]
  },
  {
    path: '/approval',
    component: Layout,
    children: [
      {
        path: '',
        name: 'approval',
        component: () => import('@/views/government/approval/approval'),
        meta: { title: '许可备案审批', icon: 'license' }
      }
    ]
  },
  {
    path: '/recordPrint',
    component: Layout,
    children: [
      {
        path: '',
        name: 'recordPrint',
        component: () => import('@/views/government/recordPrint/recordPrint'),
        meta: { title: '许可备案打印', icon: 'license' }
      }
    ]
  },
  {
    path: '/allApplication',
    component: Layout,
    children: [
      {
        path: '',
        name: 'allApplication',
        component: () =>
          import('@/views/government/allApplication/allApplication'),
        meta: { title: '全部许可申请', icon: 'license' }
      }
    ]
  },
  {
    path: '/batchreport',
    component: Layout,
    children: [
      {
        path: '',
        name: 'batchreport',
        component: () => import('@/views/government/batchreport/batchreport'),
        meta: { title: '生产经营情况', icon: 'license' }
      }
    ]
  },
  {
    path: '/annalsreport',
    component: Layout,
    children: [
      {
        path: '',
        name: 'annalsreport',
        component: () => import('@/views/government/batchreport/annalsreport'),
        meta: { title: '年报上报', icon: 'license' }
      }
    ]
  },
  // annalsreport
  {
    path: '/annalsreporthistory',
    component: Layout,
    children: [
      {
        path: '',
        name: 'annalsreporthistory',
        component: () =>
          import('@/views/government/batchreport/annalsreporthistory'),
        meta: { title: '年度上报历史记录', icon: 'license' }
      }
    ]
  },
  {
    path: '/corpannalsjg',
    component: Layout,
    children: [
      {
        path: '',
        name: 'corpannalsjg',
        component: () => import('@/views/government/batchreport/corpannalsjg'),
        meta: { title: '企业年报', icon: 'license' }
      }
    ]
  },
  {
    path: '/quarterly',
    component: Layout,
    children: [
      {
        path: '',
        name: 'quarterly',
        component: () => import('@/views/government/quarReport/quarReport'),
        meta: { title: '颁证情况统计', icon: 'license' }
      }
    ]
  },
  {
    path: '/annualreport',
    component: Layout,
    children: [
      {
        path: '',
        name: 'annualreport',
        component: () => import('@/views/government/batchreport/annualreport'),
        meta: { title: '企业年报汇总表', icon: 'license' }
      }
    ]
  },
  {
    path: '/quarterlyreports',
    component: Layout,
    children: [
      {
        path: '',
        name: 'quarterlyreports',
        component: () =>
          import('@/views/government/quarReport/quarterlyreports'),
        meta: { title: '颁证季报', icon: 'license' }
      }
    ]
  },
  {
    path: '/tongjiyi',
    component: Layout,
    children: [
      {
        path: '',
        name: 'tongjiyi',
        component: () => import('@/views/government/batchreport/tongjiyi'),
        meta: { title: '生产经营统计表', icon: 'license' }
      }
    ]
  },
  {
    path: '/tongjier',
    component: Layout,
    children: [
      {
        path: '',
        name: 'tongjier',
        component: () => import('@/views/government/quarReport/tongjier'),
        meta: { title: '颁证化学品统计', icon: 'license' }
      }
    ]
  },
  {
    path: '/recordManagement',
    component: Layout,
    children: [
      {
        path: '',
        name: 'recordManagement',
        component: () =>
          import('@/views/government/recordManagement/recordManagement'),
        meta: { title: '许可备案管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/systemOrganization',
    component: Layout,
    children: [
      {
        path: '',
        name: 'systemOrganization',
        component: () =>
          import('@/views/government/systemOrganization/systemOrganization'),
        meta: { title: '监管机构', icon: 'license' }
      }
    ]
  },
  {
    path: '/systemUser',
    component: Layout,
    children: [
      {
        path: '',
        name: 'systemUser',
        component: () => import('@/views/government/systemUser/systemUser'),
        meta: { title: '用户管理', icon: 'license' }
      }
    ]
  },
  {
    path: '/systemAccredit',
    component: Layout,
    children: [
      {
        path: '',
        name: 'systemAccredit',
        component: () =>
          import('@/views/government/systemAccredit/systemAccredit'),
        meta: { title: '生产经营授权', icon: 'license' }
      }
    ]
  },
  {
    path: '/systemRule',
    component: Layout,
    children: [
      {
        path: '',
        name: 'systemRule',
        component: () => import('@/views/government/systemRule/systemRule'),
        meta: { title: '评分规则配置', icon: 'license' }
      }
    ]
  },
  {
    path: '/systemAnnals',
    component: Layout,
    children: [
      {
        path: '',
        name: 'systemAnnals',
        component: () => import('@/views/government/systemAnnals/systemAnnals'),
        meta: { title: '年报解除上报', icon: 'license' }
      }
    ]
  },
  {
    path: '/systemQuarterly',
    component: Layout,
    children: [
      {
        path: '',
        name: 'systemQuarterly',
        component: () =>
          import('@/views/government/systemQuarterly/systemQuarterly'),
        meta: { title: '季报解除上报', icon: 'license' }
      }
    ]
  },
  {
    path: '/dictionaries',
    component: Layout,
    children: [
      {
        path: '',
        name: 'dictionaries',
        component: () => import('@/views/government/dictionaries/dictionaries'),
        meta: { title: '字典管理', icon: 'license' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_ENV === 'dev' ? '' : '/dist/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export default router
