import Vue from 'vue'
import Router from 'vue-router'
import config from '../../config'

Vue.use(Router)

export default new Router({
  base: process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath,
  mode: 'history',
  routes: [
    { path: '*', component: (resolve) => require(['../components/404'], resolve) },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: (resolve) => require(['../view/login'], resolve)
    },
    {
      path: '/meeting',
      component: (resolve) => require(['../view/main-menu'], resolve),
      children: [
        {
          path: '/meeting',
          component: (resolve) => require(['../view/meeting'], resolve)
        },
        {
          path: '/initiating',
          name: '发起活动',
          component: (resolve) => require(['../view/initiating'], resolve)
        },
        {
          path: '/role',
          name: '用户管理',
          component: (resolve) => require(['../view/table/role'], resolve)
        },
        {
          path: '/region',
          name: '区域管理',
          component: (resolve) => require(['../view/table/region'], resolve)
        },
        {
          path: '/menuTable',
          name: '菜单管理',
          component: (resolve) => require(['../view/table/menu-table'], resolve)
        },
        {
          path: '/base',
          component: (resolve) => require(['../view/base'], resolve),
          children: [
            {
              path: 'overview',
              name: '活动概况',
              component: (resolve) => require(['../view/overview'], resolve)
            },
            {
              path: 'info',
              name: '基本信息',
              component: (resolve) => require(['../view/info'], resolve)
            },
            {
              path: 'userlist',
              name: '人员管理',
              component: (resolve) => require(['../view/userlist/index'], resolve)
            },
            {
              path: 'exhibition',
              name: '展台管理',
              component: (resolve) => require(['../view/exhibition/index'], resolve)
            },
            {
              path: 'exhibitionDetails',
              name: '展台详情',
              component: (resolve) => require(['../view/exhibition/exhibition-details'], resolve)
            },
            {
              path: 'userDetails',
              name: '人员详情',
              component: (resolve) => require(['../view/userlist/user-details'], resolve)
            },
            {
              path: 'flowDistribution',
              name: '人流量分布',
              component: (resolve) => require(['../view/flow-distribution'], resolve)
            },
            {
              path: 'flowDetail',
              name: '流量明细',
              component: (resolve) => require(['../view/flow-detail'], resolve)
            },
            {
              path: 'flowedStatistics',
              name: '流量统计',
              component: (resolve) => require(['../view/flowed-statistics'], resolve)
            }
          ]
        }
      ]
    }
  ]
})
