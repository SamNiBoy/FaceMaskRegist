// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    counterId: '',
    openid: '',
    id: '',
    name: '',
    sex: '',
    phone: '',
    address: '',
    ordqty: '',
    pckdte: '',
    pckqty: '',
    queryResult: 0
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  onAdd: function () {
    var status = validateData(this);
    if (status === 0)
    {
     const db = wx.cloud.database()
     db.collection('records').add({
       data: {
        sq: this.data.sq[this.data.index],
        id: this.data.id,
        name: this.data.name,
        sex: this.data.sex[this.data.index2],
        phone: this.data.phone,
        address: this.data.address,
        ordqty: this.data.ordqty,
        pckdte: this.data.pckdte,
        pckqty: 0
       },
       success: res => {
    //     // 在返回结果中会包含新创建的记录的 _id
         this.setData({
           counterId: res._id,
           index: 0,
           id: '',
           name: '',
           index2: 0,
           phone: '',
           address: '',
           ordqty: '',
           pckdte: ''
         })
         wx.showToast({
           title: '预约成功',
           duration: 3000
         })
         console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
       },
       fail: err => {
         wx.showToast({
           icon: 'none',
           title: '预约失败,请联系管理员',
           duration: 3000
         })
         console.error('[数据库] [新增记录] 失败：', err)
       }
     })
    }
  },

  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('records').where({
      _openid: this.data.openid,
      id: this.data.id
    }).get({
      success: res => {
        if(res.data.length > 0)
        {
        this.setData({
          //queryResult: JSON.stringify(res.data, null, 2)
          id: res.data[0].id,
          name: res.data[0].name,
          sex: res.data[0].sex,
          phone: res.data[0].phone,
          address: res.data[0].address,
          ordqty: res.data[0].ordqty,
          pckdte: res.data[0].pckdte,
          pckqty: res.data[0].pckqty
        }),
          this.setData({ queryResult:0})
        }
        else
        {
          wx.showToast({
            icon: 'none',
            title: '该身份证没有预约',
            duration: 2000
          }),
            this.setData({ queryResult: -1})
        }
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询异常,请联系管理员',
          duration: 2000
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onCounterInc: function() {
    // const db = wx.cloud.database()
    // const newCount = this.data.count + 1
    // db.collection('counters').doc(this.data.counterId).update({
    //   data: {
    //     count: newCount
    //   },
    //   success: res => {
    //     this.setData({
    //       count: newCount
    //     })
    //   },
    //   fail: err => {
    //     icon: 'none',
    //     console.error('[数据库] [更新记录] 失败：', err)
    //   }
    // })
  },

  onCounterDec: function() {
    // const db = wx.cloud.database()
    // const newCount = this.data.count - 1
    // db.collection('counters').doc(this.data.counterId).update({
    //   data: {
    //     count: newCount
    //   },
    //   success: res => {
    //     this.setData({
    //       count: newCount
    //     })
    //   },
    //   fail: err => {
    //     icon: 'none',
    //     console.error('[数据库] [更新记录] 失败：', err)
    //   }
    // })
  },

  onRemove: function() {
    // if (this.data.counterId) {
    //   const db = wx.cloud.database()
    //   db.collection('counters').doc(this.data.counterId).remove({
    //     success: res => {
    //       wx.showToast({
    //         title: '删除成功',
    //       })
    //       this.setData({
    //         counterId: '',
    //         count: null,
    //       })
    //     },
    //     fail: err => {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '删除失败',
    //       })
    //       console.error('[数据库] [删除记录] 失败：', err)
    //     }
    //   })
    // } else {
    //   wx.showToast({
    //     title: '无记录可删，请见创建一个记录',
    //   })
    // }
  },

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },
  bindInputId(e) {
    this.setData({
      id: e.detail.value
    })
  }

});

function validateData(that) {
  if (that.data.id === '') {
    wx.showToast({
      title: '请输入身份证',
      icon: 'fail',
      duration: 2000
    });
    return 1;
  }
  return 0;
};