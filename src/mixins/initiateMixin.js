export const initiateMixin = {
  methods: {
    /**
     * 基本信息提交
     * @param id
     */
    basicEvent(id) {
      let _params = {
          name: this.basicVal.title, // 名称
          status: this.status, // 内容
          content: this.basicVal.mavonValue, // 内容
          city1: this.basicVal.city1, // 地址
          city2: this.basicVal.city2, // 地址
          address: this.basicVal.address, // 地址
          beginTime: this.$refs.timePicker.getValue().beginTime, // 开始时间
          endTime: this.$refs.timePicker.getValue().endTime, // 结束时间
          principal: '',
          remark: this.basicVal.abstract,
        }
      if (id) {
        _params.status = undefined
        _params.id = id
      }
      if (!id && this.basicVal.dataFile == '') {
        this.$Message.error('请上传海报')
        return
      }
      if(!id && !this.verification(_params, this.msgTip)) return
      console.log(_params)
      let fileData = new FormData()
      if (this._isChangePostImg()) fileData.append('file', this.basicVal.dataFile)
      for (let key in _params) {
        fileData.append('' + key, _params[key])
      }
      _params.file = fileData
      this.disabled = true
      this.requestFile('post', 'activitys', fileData).then((data) => {
          if (data.success) {
            this.status = data.data.status
            this.$Message.success((id ? '保存' :'发布') + '成功')
            this.disabled = false
            this.id = data.data.id
            this.basicVal.createTime =  data.data.createTime.time
            if(id) this.routePush('/meeting')
          } else {
            this.disabled = false
            this.$Message.success((id ? '保存' :'发布') + '失败')
          }
        }, (err) => {
      this.disabled = false
       this.$Message.success((id ? '保存' :'发布') + '失败')
      })
    },
    /**
     * 发布活动
     */
    releaseEvent () {
      let organize = this.$refs.organize.getData(),
         contactWay = this.$refs.contactWay.getData()
      let parmas = {
        id: this.id,
        organization: JSON.stringify(organize),
        contact: JSON.stringify(contactWay),
        status: 0
      }
      this.requestAjax('post', 'activitys', parmas).then(res => {
        this.$Message[res.success ? 'success' : 'warning'](res.desc)
        if(res.success) this.routePush('/meeting')
      })
    }
  }
}
