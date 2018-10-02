<template>
  <div class="wrapper">
    <div class="wrapper-box">
      <Row type="flex" :gutter=5>
        <i-col span="16">
          <Row type="flex" justify="start">
            <i-col>
              <Button type="primary" @click="routePush('/initiating')">发起活动</Button>&nbsp;
            </i-col>
            <!--<i-col class="m-l10 l-h30">-->
            <!--<Icon type="volume-high" color="#e1244e" size="16"></Icon>&nbsp;<span class="c1">更多活动操作，请使用小程序【聚热会】或关注公众号</span>-->
            <!--</i-col>-->
          </Row>
        </i-col>
        <i-col span="8">
          <Row type="flex" justify="end">
            <i-col>
              <i-input class="width-letf" placeholder="请输入活动名称" v-model="keyWord"></i-input>
            </i-col>
            <i-col>
              <Button type="primary"  class="m-l5" icon="ios-search" @click="searchDriver">搜索</Button>
            </i-col>
          </Row>
        </i-col>
      </Row>

      <Menu mode="horizontal" active-name="all" @on-select="menuSelect" class="rgba3 m-t5">
        <MenuItem name="all">全部活动</MenuItem>
        <MenuItem name="1">未开始</MenuItem>
        <MenuItem name="2">进行中</MenuItem>
        <MenuItem name="99">已结束</MenuItem>
      </Menu>

      <div class="list-wrapper">
        <ul class="list">
          <li class="list-item fbox" v-for="item in data" :key="item.id">
            <meeting-item :row="item" @cancel="cancel"></meeting-item>
          </li>
        </ul>

        <!--分页-->
        <div style="text-align: right; padding-top: 5px;">
          <Page show-total show-sizer show-elevator style="display: inline-block;" placement="top"
                :total="total"
                :page-size="parms.limit"
                :current="parms.offset"
                @on-change="changePage"
                @on-page-size-change="changeSize"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import meetingItem from 'components/meeting-item/index'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'userData'
      ])
    },
    data () {
      return {
        keyWord: '',
        total: 0,
        data: [],
        timer: {},
        parms: {
          type: '0',
          limit: 20,
          offset: 1
        },
        loadImg: ''
      }
    },
    methods: {
      searchDriver () {
        this.parms.keyWord = this.keyWord
        this.parms.limit = 20
        this.parms.offset = 1
        this.initItem()
      },
      menuSelect (name) {
        if((name == 'all' &&  this.parms.status != '') || (name != 'all' && this.parms.status!= name) ){
          this.parms.status = name == 'all' ? '' : name
          this.initItem()
        }
      },
      addMeeting () {
        this.routePush('/activity')
      },
      /**
       *跳页
       * @param v
       */
      changePage (v) {
        this.parms.offset = v
        this.initItem()
      },
      /**
       *改变页面展示用户条数
       * @param v
       */
      changeSize (v) {
        this.parms.limit = v
        this.initItem()
      },
      /**
       * 加载活动
       */
      initItem () {
        const _type = 'GET'
        const _params = this.parms
        const _url = 'activitys'
        this.requestAjax(_type, _url, _params).then((data) => {
          if (data.success) {
            this.total = !isNaN(+data.data.total) ? +data.data.total : 0
            this.data = data.data.rows
          } else {
            this.data = []
          }
        })
      },
      /**
       * 取消活动
       */
      cancel () {
        this.initItem()
      }
    },
    components: {
      meetingItem
    },
    mounted () {
      this.$nextTick(() => {
        this.parms.memberId = this.userData.id
        this.initItem()
        document.querySelector('.ivu-page-options-elevator').title = '输入后回车跳至指定页'
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.initItem()
        }, 60 * 1000)
      })
    },
    destroyed () {
      window.onresize = function () {}
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>

  .wrapper{
    margin: 10px;
  }
  .list-wrapper{
    margin: 10px 0;
  }
  .list-item{
    position: relative;
    border: 1px solid #e3e2e5;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }
</style>
