export default {
  install (Vue, options) {

    // const preuUrl = 'https://pmp.coreware.cn:8444/mice/'
    const preuUrl = 'qj/mice/'
    // const preuUrl = 'mice/'
    const preuUrl2 = 'mp/'
    /**
     * 公用请求接口统一管理方法
     * @param key
     */
    const requestUrl = {
      // 登录
      login: {url: 'base_users/login', pre: preuUrl},
      // 微信登录
      loginWx: {url: 'base_users/loginWx', pre: preuUrl},
      // 退出登录
      logout: {url: 'base_users/logout', pre: preuUrl},
      // get查询用户 post添加或修改用户用信息
      members: {url: 'base_users', pre: preuUrl},
      // 删除用户
      deleteMembers: {url: 'base_users/{id}', pre: preuUrl},
      // 修改用户密码
      updatePwd: {url: 'base_users/updatePwd', pre: preuUrl},
      // 上传文件
      upload: {url: 'base_files/upload', pre: preuUrl},
      // 上传成员附件
      uploadNumber: {url: 'members/upload', pre: preuUrl},
      // 查询添加活动
      activitys: {url: 'act_activitys', pre: preuUrl},
      // 查询最热活动
      activityTopN: {url: 'cst_logAction/activityTopN', pre: preuUrl},
      // 查询活动详情
      activitysInfo: {url: 'act_activitys/info/{id}', pre: preuUrl},

      // 查询活动信息
      report: {url: 'act_activitys/report', pre: preuUrl},

      // 签到统计
      reportSign: {url: 'act_activitys/reportSign', pre: preuUrl},
      // 报名统计
      reportEntered: {url: 'act_activitys/reportEntered', pre: preuUrl},
      // 活动报名表
      reportEnteredDateInfo: {url: 'act_activitys/reportEnteredDateInfo', pre: preuUrl},
      // 活动报名订单统计
      reportOrderInfo: {url: 'act_activitys/reportOrderInfo', pre: preuUrl},
      // 按时间统计流量
      queryAccessCt: {url: 'cst_logAction/queryAccessCt', pre: preuUrl},
      // 时间统计流量-统计每分钟流量
      queryAccessCtByMinList: {url: 'cst_logAction/queryAccessCtByMinList', pre: preuUrl},
      ctByFormat: {url: 'cst_logAction/ctByFormat', pre: preuUrl},
      // 时间统计流量-统计每个url流量
      queryAccessCtByUrlList: {url: 'cst_logAction/queryAccessCtByUrlList', pre: preuUrl},
      // 按类型统计流量
      queryAccessCtByType: {url: 'cst_logAction/queryAccessCtByType', pre: preuUrl},
      // 查询活动分来
      activitysConfig: {url: 'activitys/config', pre: preuUrl},
      // 查询活动分来
      findTree: {url: 'base_configs/findTree', pre: preuUrl},
      // 查询活动详情
      queryMemberBalance: {url: 'act_balanceLogs/queryActMemberBalance', pre: preuUrl},


      // 统计已结束活动概况
      statisticalActivity: {url: 'act_activitys/statisticalActivity', pre: preuUrl},
      // 统计已结束活动--每个票券价格
      statisticalActivityTicketPrice: {url: 'act_activitys/statisticalActivityTicketPrice', pre: preuUrl},
      // 统计已结束活动--每个票券价格
      statisticalActivityTicketDesc: {url: 'act_activitys/statisticalActivityTicketDesc', pre: preuUrl},

      // 个人用户扩展信息表
      cst_user_members: {url: 'cst_user_members', pre: preuUrl},

      // 菜单管理
      baseMenus: {url: 'base_menus', pre: preuUrl},
      // 菜单管理删改
      baseMenusId: {url: 'base_menus/{id}', pre: preuUrl},
      // 菜单管理
      baseRoles: {url: 'base_roles', pre: preuUrl},
      // 菜单管理删改
      baseRolesId: {url: 'base_roles/{id}', pre: preuUrl},
      // 获取用户菜单
      getRoleMemu: {url: 'base_menus/getRoleMemu', pre: preuUrl},

      meetingsQueryList: {url: 'act_meetings/queryList', pre: preuUrl},
      meetingsQueryStudents: {url: 'act_meetings/queryStudents', pre: preuUrl},
      meetingsReport: {url: 'act_meetings/report', pre: preuUrl}
    }
    /**
     * 获取url
     * @param key
     * @param id
     */
    Vue.prototype.getWbkUrl = function (key, id) {
      if (id && id !== undefined) {
        return requestUrl[key].pre + requestUrl[key].url.replace('{id}', id)
        // return requestUrl[key].url.replace('{id}', id)
      } else {
        return requestUrl[key].pre + requestUrl[key].url
        // return requestUrl[key].url
      }
    }
  }
}
