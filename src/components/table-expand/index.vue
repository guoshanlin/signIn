<template>
   <div>
     <div class="form-group">
       <div class="float-l table-title">
         <div>票种说明:</div>
       </div>
       <div class="float-r table-fill">
         <div class="t-left">
           <i-input v-model="data.explain" type="textarea" :rows="4" placeholder="限200字内"></i-input>
         </div>
       </div>
       <div class="clearFix"></div>
     </div>
     <div class="form-group">
       <div class="float-l table-title">
         <div>是否审核:</div>
       </div>
       <div class="float-r table-fill">
         <div>
           <Checkbox v-model="data.toExamine">凡报名、订购此类票需要经过我的审核</Checkbox>
         </div>
       </div>
       <div class="clearFix"></div>
     </div>
     <div class="form-group">
       <div class="float-l table-title">
         <div>订购日期:</div>
       </div>
       <div class="float-r table-fill">
         <div class="t-left">
           <Checkbox v-model="data.orderDate">默认为活动结束前</Checkbox>
           <DatePicker v-if="!data.orderDate" v-model="data.orderTime" class="full-width" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="订购活动开始时间 - 订购结束时间"></DatePicker>
         </div>
       </div>
       <div class="clearFix"></div>
     </div>
     <div class="form-group">
       <div class="float-l table-title">
         <div>有效日期:</div>
       </div>
       <div class="float-r table-fill">
         <div class="t-left">
            <Checkbox v-model="data.effectiveDate">默认为活动期间内有效</Checkbox>
           <DatePicker v-if="!data.effectiveDate" v-model="data.effectiveTime" class="full-width" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="有效开始时间 - 有效结束时间"></DatePicker>
         </div>
       </div>
       <div class="clearFix"></div>
     </div>
     <div class="form-button t-left">
       <i-button type="primary" @click="saveTicket">保存</i-button>
       <i-button @click="hideTicket">关闭</i-button>
     </div>
   </div>
</template>

<script>
    export default {
      name: 'index',
      data () {
       return {
         data: {
           explain: this.row.explain,
           toExamine: this.row.toExamine,
           orderDate: this.row.orderDate,
           orderTime: this.row.orderTime,
           effectiveDate: this.row.effectiveDate,
           effectiveTime: this.row.effectiveTime
         }
       }
      },
      props: {
        row: {},
        index: 0
      },
      watch: {
        row (val) {
          this.data.explain = val.explain
          this.data.toExamine = val.toExamine
          this.data.orderDate = val.orderDate
          this.data.orderTime = val.orderTime
          this.data.effectiveDate = val.effectiveDate
          this.data.effectiveTime = val.effectiveTime
        }
      },
      methods: {
        hideTicket () {
          this.$emit('onExpand', this.data, 'hide')
        },
        saveTicket () {
          this.$emit('onExpand', this.data, 'save')
        }
      }
    }
</script>
<style scoped>
  .table-title{width:150px; }
  .table-fill{width: calc(100% - 150px);}
</style>
