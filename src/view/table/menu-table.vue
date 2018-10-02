<template>
  <div class="wrapper wrapper-box">
    <Menu mode="horizontal" active-name="0" @on-select="menuSelect" class="rgba3">
      <MenuItem name="0">用户设置</MenuItem>
      <MenuItem name="1">角色设置</MenuItem>
      <MenuItem name="2">菜单设置</MenuItem>
    </Menu>
    <div v-if="indexNumber == '0'" class="m-t15">
      <user-table></user-table>
    </div>
    <div v-if="indexNumber == '1'" class="m-t15">
      <role-table></role-table>
    </div>
    <div v-if="indexNumber == '2'" class="m-t15">
      <menu-table></menu-table>
    </div>
  </div>
</template>
<script>
 import inputFrom from 'components/modal/inputFrom.vue'
 import menuTable from 'components/menu-list/menu-table.vue'
 import roleTable from 'components/menu-list/role-table.vue'
 import userTable from 'components/menu-list/user-table.vue'
 import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        indexNumber: '0'
      }
    },
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    components: {
       inputFrom,
       menuTable,
       roleTable,
       userTable
    },
    methods: {
      menuSelect (v) {
        this.indexNumber = v
      }
    }
  }
</script>

<style scoped>
  .wrapper{
    margin: 10px;
  }
  .ivu-menu-horizontal{ height: 40px; line-height: 40px;}
</style>
