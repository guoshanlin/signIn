<template>
  <div class="meeting-item">
    <div class="fbox meeting-item">
      <div class="pic-wrapper">
        <a @click="topage('/base/info',row.id, row.type)"><img width="100%" height="100%" v-lazy="loadImg"></a>
        <span class="tips b1 c">{{getActiveStatus(row.status,row.type)}}</span>
      </div>
      <div class="info-wrapper flex c2">
        <div class="fbox">
          <div class="flex">
            <h3 class="fz15 title"><a class="hover-c2" @click="topage('/base/info',row.id, row.type)">{{row.name}}</a></h3>
            <div class="fbox">
              <div class="flex">
                <!--<div>活动ID：{{row.id}} <span class="b2 c3 meeting-version">体验版</span></div>-->
                <div>活动ID：{{row.id}}</div>
              </div>
              <div class="flex">
                <Icon type="person"></Icon>
                发布者：{{row.nickName ? row.nickName : row.userName}}
              </div>
            </div>
            <div class="fbox">
              <div class="flex">
                <div><Icon type="clock"></Icon>{{formatterObjTime(row.beginTime)}} ~ {{formatterObjTime(row.endTime)}}</div>
              </div>
              <div class="flex">
                <Icon type="ios-location"></Icon>
                {{row.city1 + row.city2 +row.address}}
              </div>
            </div>
          </div>
          <!--<div>-->
            <!--<Button type="primary" :data="row.id" @click="topage('/base/overview',row.id, row.type)">管理</Button>-->
            <!--<br>-->
            <!--<Button v-if='row.status == 1 && row.numberActual < row.number' class="m-t10" @click="cancel">取消</Button>-->
          <!--</div>-->
        </div>
        <div class="fbox tools-wrapper">
          <div class="flex"><a class="c2" @click="topage('/base/overview',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            活动概况</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/info',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            基本信息</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/userlist',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            人员管理</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/exhibition',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            展台管理</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/flowDistribution',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            人流量分布</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/flowDetail',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            流量明细</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/flowed-statistics',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            流量统计</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/flowed-statistics',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            区域统计</a></div>
          <div class="flex"><a class="c2" @click="topage('/base/flowed-statistics',row.id, row.type)">
            <Icon type="ios-paper-outline c1"></Icon>
            人员统计</a></div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  import {mapMutations} from 'vuex'

  export default {
    name: 'index',
    data () {
      return {
        loadImg: this.$global + this.row.posterUrl
      }
    },
    props: {
      row: '',
      button: ''
    },
    methods: {
      ...mapMutations({
        setDraftActivity: 'SET_DRAFT_ACTIVITY'
      }),
      cancel () {
        this.requestAjax('post', 'activitys', {id: this.row.id, status: 3}).then((data) => {
          if (data.success) {
            this.$Message.success('取消成功')
            this.$emit('cancel')
          } else {
            this.$Message.success('取消失败')
          }
        }, () => {
          this.$Message.success('取消失败')
        })
      },
      editActivity () {
        this.setDraftActivity(this.row)
        this.routePush('/initiatingActivity', this.row.id, this.row.type)
      },
      topage (path, id, type) {
        this.setDraftActivity(this.row)
        this.routePush(path, id, type)
      },
      getText (val) {
        return val.replace(/<[^>]*>|/g, '')
        // var _damo = document.createElement("div")
        // _damo.innerHTML = val
        // console.log(_damo.innerText)
        // console.log(val.replace(/<[^>]*>|/g,""))
      }
    }
  }
</script>

<style scoped>
  .meeting-item{
    width: 100%;
  }
  /*  .manage-btn{
      position: absolute;
      top: 23px;
      right: 30px;
    }
    .manage-btn-c{
      position: absolute;
      top: 65px;
      right: 30px;
    }*/

  .title{
    font-weight: 700;
    line-height: 30px;
  }

  .pic-wrapper{
    width: 130px;
    height: 130px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .pic-wrapper .tips{
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px 10px;
    border-radius: 0 4px 0 4px;
  }
  .info-wrapper{
    padding: 10px;
    line-height: 20px;
  }
  .meeting-version{
    padding: 2px 8px;
    border-radius: 3px;
    margin-left: 8px
  }
  .tools-wrapper{
    border-top: 1px solid #e3e2e5;
    margin-top: 8px;
    padding-top: 5px;
  }
  .article-content{
    line-height: 20px;
    max-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

</style>
