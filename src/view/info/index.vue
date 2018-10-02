<template>
  <div class="wrapper-box">
    <Menu mode="horizontal" active-name="0" class="rgba3" @on-select="indexChange">
      <MenuItem name="0">基本信息</MenuItem>
      <MenuItem name="1">消息提醒</MenuItem>
      <MenuItem name="2">餐饮菜谱</MenuItem>
    </Menu>
    <div>
      <v-release v-if="tabIndex == 0"></v-release>
      <div  v-if="tabIndex == 1">
       <msg-remind></msg-remind>
      </div>
      <div  v-if="tabIndex == 2">
        <cookery-book></cookery-book>
      </div>
    </div>
  </div>
</template>

<script>

  import vRelease from 'components/release'
  import msgRemind from 'components/msg-remind'
  import cookeryBook from 'components/cookery-book'

  export default {
    data () {
      return {
        tabIndex: 0,
        activesType: 0,
        id: this.$route.query.id
      }
    },
    created () {
      setTimeout(() => {

      }, 20)
    },
    components: {
      vRelease,
      msgRemind,
      cookeryBook
    },
    methods: {
      getActivesType (type) {
        this.activesType = type
      },
      indexChange (v) {
        if(this.tabIndex == '0' || this.tabIndex == '2') {
           UE.delEditor('ueditor')
        }
        this.tabIndex = v
      }
    }
  }
</script>

<style scoped>


</style>
