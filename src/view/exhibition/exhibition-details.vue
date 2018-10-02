<template>
  <div class="b wrapper-box">
    <h3 class="fz14">展台详情</h3>
    <div class="content-wrapper wrapper-border m-t20">
      <div class="fbox">
        <div class="pic-wrapper">
          <img width="100%" height="100%"
               src="https://www.juniwota.com/qj/mice/base_files/down?path=files/mice/201809/activity_6OHZ3Z0CUU5AONSF_com.jpg">
        </div>
        <div class="info-wrapper flex c2">
          <h3 class="fz13">展台名称&nbsp;&nbsp;</h3>
          <div class="fbox">
            <!--  <div class="flex">
                <div class="">状态：<span class="b2 c3 meeting-version">{{getActiveStatus(row.status)}}</span> </div>
              </div>-->
            <div class="flex">
              <div class="">展台编号：1111</div>
            </div>
            <div class="flex">
              <div class="">注册时间：2018-09-01</div>
            </div>
          </div>
          <div class="fbox">
            <div class="flex">
              <div>所属分类：个人/企业</div>
            </div>
            <div class="flex">
              公司：公司
            </div>
          </div>
          <div class="fbox">
            <div class="flex">
              <div>标签：标签</div>
            </div>
            <div class="flex">
              附件： <a>
              <Icon type="ios-download-outline" size="16"></Icon>
              附件</a>
            </div>
          </div>
        </div>
      </div>
      <div class="content-wrapper wrapper-border m-t20">
        <div>简介:</div>
        <div>
          <pre>展台简介展台简介展台简介展台简介展台简介展台简介展台简介展台简介展台简介展台简介展台简介</pre>
        </div>
      </div>
      <div class="content-wrapper wrapper-border m-t20">
        <div>详情:</div>
        <div>
        <pre>展台详情展台详情展台详情
          展台详情展台详情展台详情展台详情展台
          详情展台详情展台详情展台详情展台详情展台详情展台详情
        </pre>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        userId: this.$route.query.id,
        user: {},
      }
    },
    created() {
      setTimeout(() => {
        // this.requestOrderInfo()
      }, 20)
    },
    methods: {
      requestOrderInfo() {
        this.requestAjax('get', 'usersInfo', {}, this.userId).then(res => {
          if (res.success) {
            // this.user = res.data.data
            // this.tableData = []
          }

        })
      }
    }
  }
</script>

<style scoped>
  .pic-wrapper {
    width: 130px;
    height: 130px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .pic-wrapper .tips {
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px 10px;
    border-radius: 0 4px 0 4px;
  }

  .info-wrapper {
    padding: 10px 20px;
    line-height: 28px;
  }
</style>
