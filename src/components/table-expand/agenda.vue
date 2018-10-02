<template>
  <div class="p-10" style="background-color: #fff">
    <div class="wrapper-box m-t10" v-if="data.length == 0">
      <div class="plr5 t-center">暂未议程详情 <i-button type="ghost" shape="circle" @click="addAgenda" size="small" icon="plus-round"></i-button></div>
    </div>
    <div class="wrapper-box m-t10" v-for="(item, index) in data" :key="index">

           <div class="fbox">
             <div class="flex">
               <div class="fbox">
                 <div class="ag-title">
                   时间段:
                 </div>
                 <div class="flex">
                   <i-input type="text" v-model="data[index].timeSlot" placeholder="请填写时间段"></i-input>
                 </div>
               </div>
             </div>
             <div class="flex">
               <div class="fbox">
                 <div class="ag-title">
                   演讲人:
                 </div>
                 <div class="flex">
                   <i-input type="text" v-model="data[index].speaker" placeholder="请填写演讲人"></i-input>
                 </div>
               </div>
             </div>
           </div>
           <div class="fbox m-t10">
             <div class="ag-title">主题/内容:</div>
             <div class="flex">
               <i-input type="textarea" :rows="3" v-model="data[index].number" placeholder="请填写议程主题/内容概要"></i-input>
             </div>
           </div>
          <i-button class="btn-del" type="error" size="small"  shape="circle" icon="close" title="删除" @click="data.splice(index, 1)"></i-button>
    </div>
    <div v-if="data.length > 0" class="plr5 t-center m-t15">
        <i-button type="ghost" icon="plus-round" @click="addAgenda">添加议程详情</i-button>
        <i-button type="ghost" @click="hideTicket">收起</i-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        data: []
      }
    },
    props: {
      row: '',
      index: 0
    },
    watch: {
      row (val) {
        this.data = JSON.parse(val)
      },
      data: {
        handler (val, oldVal) {
          this.$emit('change', JSON.stringify(this.data), this.index)
        },
        deep: true
      }
    },
    beforeCreate () {
      this.$nextTick(() => {
        if (this.row) {
          this.data = JSON.parse(this.row)
        }
      })
    },
    methods: {
      /**
       * 添加议程详情
       */
      addAgenda () {
        const _obj = {timeSlot: '', summary: '', speaker: ''}
        this.data.push(Object.assign({}, _obj))
      },
      hideTicket () {
        this.$emit('on-hide', JSON.stringify(this.data), 'hide')
      },
    }
  }
</script>

<style scoped>
  .ivu-form-item {margin-bottom: inherit}
  .plr5{ padding: 0 5px;}
  .ag-title{margin: 0 10px; text-align: right}
  .wrapper-box{ position: relative; padding:20px;}
  .btn-del{position: absolute; top: -6px; right: -6px;}
</style>
