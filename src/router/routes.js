import Layout from '../layout'

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const asyncRoutes = [
  {
    path: '/game',
    name: 'game',
    component: Layout,
    redirect: '/game/gameManagement',
    meta: {
      title: '游戏信息管理',
      icon: 'vue-dsn-icon-yuyan'
    },
    children: [
      {
        path: 'gameType',
        name: 'gameType',
        component: () => import('../views/game/GameType'),
        meta: {
          title: '游戏类型'
        }
      },
      {
        path: 'gameCompany',
        name: 'gameCompany',
        component: () => import('../views/game/GameCompany'),
        meta: {
          title: '游戏公司'
        }
      },
      {
        path: 'gameManagement',
        name: 'gameManagement',
        component: () => import('../views/game/GameManagement'),
        meta: {
          title: '游戏信息'
        }
      }
    ]
  },
  {
    path: '/article',
    name: 'article',
    component: Layout,
    redirect: '/article/ArticleManagement',
    meta: {
      title: '游戏测评管理',
      icon: 'vue-dsn-icon-xinfeng'
    },
    children: [
      {
        path: 'articleType',
        name: 'articleType',
        component: () => import('../views/article/ArticleType'),
        meta: {
          title: '测评类别'
        }
      },
      {
        path: 'articleManagement',
        name: 'articleManagement',
        component: () => import('../views/article/ArticleManagement'),
        meta: {
          title: '测评文章'
        }
      }

    ]
  },
  {
    path: '/gameshop',
    name: 'gameshop',
    component: Layout,
    redirect: '/gameshop/GameShops',
    meta: {
      title: '游戏商品管理',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'upgameshop',
        name: 'UpGameshop',
        component: () => import('../views/gameshop/UpGameShops'),
        meta: {
          title: '已开售商品'
        }
      },
      {
        path: 'downgameshop',
        name: 'DownGameshop',
        component: () => import('../views/gameshop/DownGameShops'),
        meta: {
          title: '未开售商品'
        }
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/gameManagement',
    meta: {
      title: '用户权限管理',
      icon: 'vue-dsn-icon-xinzeng'
    },
    children: [
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () => import('../views/user/UserManagement'),
        meta: {
          title: '用户信息'
        }
      },
      {
        path: 'auditMManagement',
        name: 'AuditMManagement',
        component: () => import('../views/user/AuditManagement'),
        meta: {
          title: '测评申请管理'
        }
      },
      {
        path: 'EvaluatorRedraw',
        name: 'EvaluatorRedraw',
        component: () => import('../views/user/EvaluatorRedraw'),
        meta: {
          title: '测评资格收回'
        }
      },
      {
        path: 'bannedManagement',
        name: 'AannedManagement',
        component: () => import('../views/user/BannedManagement'),
        meta: {
          title: '封禁申请管理'
        }
      }
    ]
  },
  {
    path: '/form-table',
    name: 'FormTable',
    component: Layout,
    redirect: '/form-table/table-classic',
    meta: {
      title: '表格&表单',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: 'table-classic',
        name: 'TableClassic',
        component: () => import('../views/form-table/TableClassic'),
        meta: {
          title: '综合表格'
        }
      },
      {
        path: 'form-list',
        name: 'FormList',
        component: () => import('../views/form-table/FormList'),
        meta: {
          title: '表单列表'
        }
      },
      {
        path: 'table-inline-edit',
        name: 'TableInlineEdit',
        component: () => import('../views/form-table/TableInlineEdit'),
        meta: {
          title: '行内编辑表格'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/error-page/404'),
    hidden: true,
    meta: { title: '404' }
  }
]
