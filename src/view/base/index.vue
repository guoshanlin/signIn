<template>
  <div class="wrapper clear">
    <div class="wrapper-box float-l" style="width: 170px;margin-right: 10px;height: fit-content;">
      <Menu theme="light" :active-name="activeNenu" width="auto"  class="menu-wrapper rgba3" @on-select="changeMenu">
        <template  v-for="(item,i) in menuList">
        <MenuGroup :title="item.title">
          <template v-for="(childItem,c) in item.child">
            <MenuItem :name="childItem.path" :key="c"><Icon :type="childItem.icon"></Icon>{{childItem.title}}</MenuItem>
          </template>
        </MenuGroup>
        </template>
      </Menu>
    </div>
    <div class="float-r" style="width: calc( 100% - 180px)">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'

  let type,id

  export default {
    data() {
      return {
        activeNenu: this.$route.path,
        menuList: [
          {
            title: '概况',
            child: [
              {icon: 'android-send', path: '/base/overview', title: '活动概况'}
            ]
          },
          {
            title: '会前',
            child: [
              {icon: 'android-textsms', path: '/base/info', title: '基本信息'},
              {icon: 'ios-people', path: '/base/userlist', title: '人员管理'},
              {icon: 'ios-people', path: '/base/exhibition', title: '展台管理'},
            ]
          },
          {
            title: '会中',
            child: [
              {icon: 'ios-people', path: '/base/flowDistribution', title: '人流量分布'},
              {icon: 'ios-people', path: '/base/flowDetail', title: '流量明细'}
            ]
          }
          // {
          //   title: '数据统计',
          //   child: [
          //     {icon: 'calculator', path: '/base/flowedStatistics', title: '流量统计'},
          //     {icon: 'calculator', path: '/base/flowedStatistics', title: '区域统计'},
          //     {icon: 'calculator', path: '/base/flowedStatistics', title: '人员统计'}
          //   ]
          // }
        ]
      }
    },
    created() {
      setTimeout(() => {
        console.log(this.$route.query.type)
        if (!this.draftActivity) {
          if (this.$route.query.url == 'plan') {
            this.routePush('/promotion/formulatePlan')
            return
          }
          this.routePush('/meeting')
           return
        }
        id = this.$route.query.id
        type = this.$route.query.type
      }, 20)
    },
    computed: {
      ...mapGetters([
        'draftActivity'
      ])
    },
    watch: {
      '$route' (to, from) {
        this.activeNenu = to.path
      }
    },
    methods: {
      changeMenu(name){
        if( this.$route.path == '/base/info') {
          UE.delEditor('ueditor')
        }
        this.routePush(name, id, type)

      }
    }
  }
</script>

<style scoped>

  .wrapper {
    margin: 10px;
  }

</style>
