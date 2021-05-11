/*
 * Copyright 2018 Liu Jiajie
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 *  checkinfo.js
 *  功能      核对信息，提交签约请求
 *  作者       xxx
 *  日期       2018-08-xx
 *  当前路由 /checkinfo
 *  前一路由 /addrelative
 *  后一路由 /result
 *  输出变量 window.app.checkinfoV
 * 
 * 
 */
;(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], function(jQuery) {
      return factory(jQuery, window, document);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'), window, document);
  } else {
    // Browser globals.
    factory(jQuery, window, document);
  }
}(function($, window, document, undefined) {
  'use strict';

  // 获取全局变量，若为空则对其初始化
  var kendo = window.kendo,
    app = window.app,
    layout = app.layout,
    router = app.router,
    layoutSelector = app.layoutSelector;

  // 对Date的扩展，将 Date 转化为指定格式的String   
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
  // 例子：   
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
  window.Date.prototype.Format = function(fmt)   
  { //author: meizz   
    var o = {   
      "M+" : this.getMonth()+1,                 //月份   
      "d+" : this.getDate(),                    //日   
      "h+" : this.getHours(),                   //小时   
      "m+" : this.getMinutes(),                 //分   
      "s+" : this.getSeconds(),                 //秒   
      "q+" : Math.floor((this.getMonth()+3)/3), //季度   
      "S"  : this.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
      if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
  }  


  // //构造单个签约账户Form DOM模板
  // var accountFormDomTemplate = '<div class="form-horizontal" data-bind="attr: {data-index: index}">\
  // <div class="form-group">\
  //   <div class="col-xs-3">\
  //     <label>姓&nbsp;&nbsp;&nbsp;名</label>\
  //   </div>\
  //   <div class="col-xs-8">\
  //     <input type="text" class="form-control" name="name" placeholder="请输入姓名"\
  //       data-bind="value: customerInformation.name"\ disabled="disabled"\
  //       required validationMessage="请输入姓名!">\
  //   </div>\
  // </div>\
  // \
  // <div class="form-group">\
  //   <div class="col-xs-3">\
  //     <label><i style="color:red;">*</i>身份证</label>\
  //   </div>\
  //   <div class="col-xs-8">\
  //     <input type="text" class="form-control" name="idCard" placeholder="请输入身份证"\
  //       data-bind="value:customerInformation.idCard"\ disabled="disabled"\
  //       required pattern="[0-9Xx]{18}" validationMessage="请输入正确格式的身份证!">\
  //   </div>\
  // </div>\
  // \
  // <div class="form-group">\
  //   <div class="col-xs-3">\
  //     <label><i style="color:red;">*</i>账&nbsp;&nbsp;&nbsp;号</label>\
  //   </div>\
  //   <div class="col-xs-8">\
  //     <input type="text" class="form-control" name="code" placeholder="请输入账号"\
  //       data-bind="value:code"\ disabled="disabled"\
  //       required pattern="[0-9]{16,19}" validationMessage="请输入正确格式的账号!">\
  //   </div>\
  // </div>\
  // \
  // \
  // <div class="form-group">\
  //     <div class="col-xs-3">\
  //       <label><i style="color:red;">*</i>开户行</label>\
  //     </div>\
  //     <div class="col-xs-8">\
  //       <input name="bankOfDeposit"\
  //         data-role="dropdownlist"\
  //         data-value-primitive="true"\
  //         data-text-field="name"\
  //         data-value-field="id"\
  //         data-bind="value: bankOfDeposit, source: products" disabled="disabled"\
  //         style="width: 100%;"\
  //         required validationMessage="请选择开户行!"\
  //       />\
  //       <!-- 加入此span以解决验证提示框显示位置问题，data-for属性必须与input的name属性一致 -->\
  //       <span class="k-invalid-msg" data-for="bankOfDeposit"></span>\
  // \
  //   </div>\
  // </div>\
  // </div>';


  // //构造单个互助人账户Form DOM模板
  // var relativeFormDomTemplate = '<div class="form-horizontal" data-bind="attr: {data-index: index}">\
  // <div class="form-group">\
  //   <div class="col-xs-3">\
  //     <label><i style="color:red;">*</i>姓&nbsp;&nbsp;&nbsp;名</label>\
  //   </div>\
  //   <div class="col-xs-8">\
  //     <input type="text" class="form-control" name="slaveName" placeholder="请输入姓名"\
  //       data-bind="value: slaveName, disabled: disabled"\
  //       required validationMessage="请输入姓名!">\
  //   </div>\
  // </div>\
  // \
  // <div class="form-group">\
  //   <div class="col-xs-3">\
  //     <label><i style="color:red;">*</i>身份证</label>\
  //   </div>\
  //   <div class="col-xs-8">\
  //     <input type="text" class="form-control" name="slaveId" placeholder="请输入身份证"\
  //       data-bind="value: slaveId, disabled: disabled"\
  //       required pattern="[0-9Xx]{18}" validationMessage="请输入正确格式的身份证!">\
  //   </div>\
  // </div>\
  // \
  // <div class="form-group">\
  //   <div class="col-xs-3">\
  //   <label><i style="color:red;">*</i>电&nbsp;&nbsp;&nbsp;话</label>\
  //   </div>\
  //   <div class="col-xs-8">\
  //     <input type="text" class="form-control" name="phone" placeholder="请输入电话"\
  //       data-bind="value: phone, disabled: disabled"\
  //       required pattern="[0-9]{11}" validationMessage="请输入正确格式的电话!">\
  //   </div>\
  // </div>\
  // \
  // \
  // <div class="form-group">\
  //     <div class="col-xs-3">\
  //       <label><i style="color:red;">*</i>关&nbsp;&nbsp;&nbsp;系</label>\
  //     </div>\
  //     <div class="col-xs-8">\
  //       <input name="relationship"\
  //         data-role="dropdownlist"\
  //         data-value-primitive="true"\
  //         data-text-field="name"\
  //         data-value-field="id"\
  //         data-bind="value: relationship, source: relations, disabled: disabled"\
  //         style="width: 100%;"\
  //         required validationMessage="请选择关系!"\
  //       />\
  //       <!-- 加入此span以解决验证提示框显示位置问题，data-for属性必须与input的name属性一致 -->\
  //       <span class="k-invalid-msg" data-for="bankOfDeposit"></span>\
  // \
  //   </div>\
  // </div>\
  // </div>';

  // 构造视图DOM模板
  var checkinfoDomTemplate =  '<header>\
  <div class="prev-btn" data-bind="click: prevPage"><i class="fa fa-chevron-left"></i></div>\
  <div class="header-title">Checking Information</div>\
</header>\
\
<div class="container-fluid with-bottom" style="padding-top: 15px;">\
  <div class="check-info"> \
    <div class="binding-accounts">\
      <div class="title">Binding Accounts</div>\
      <div class="grid-accounts"></div>\
    </div>\
    <div class="personal-relationship">\
      <div class="title">Personal Relationships</div>\
      <div class="grid-relatives"></div>\
    </div>\
  </div>\
</div>\
<div class="btn-bar fix-bottom">\
  <button class="btn btn-default" data-bind="click: prevPage">Previous</button>\
  <button class="btn btn-theme pull-right" data-bind="click: submit">Confirm & Submit</button>\
</div>';

  var gridAccountsTemplate = '<div data-role="grid"\
    data-scrollable="true"\
    data-columns="[\
      {field: \'code\', title: \'Account\'},\
      {field: \'bankOfDeposit\', title: \'Bank of Deposit\'},\
      {field: \'amt\', title: \'Balance\', width: 180}\
    ]"\
    data-bind="source: datasource"\
  ></div>';

  var gridRelativesTemplate = '<div data-role="grid"\
    data-scrollable="true"\
    data-columns="[\
      {field: \'order\', title: \'No.\', width: 60},\
      {field: \'slaveName\', title: \'Name\'},\
      {field: \'slaveId\', title: \'ID Card No.\'},\
      {field: \'phone\', title: \'Phone\', width: 150}\
    ]"\
    data-bind="source: datasource"\
  ></div>';

  // 使用template构造DOM字符串，传入从上一视图读取的变量
  var checkinfoDomString = kendo.template(checkinfoDomTemplate)({});

  // checkinfo视图view modal
  var checkinfoVM = kendo.observable({
    accountVMs: [],//{length: 0},
    relativeVMs: [], //{length: 0},
    accountGridView: null,
    relativeGridView: null,
    transactDate: null,
    init: function () {
      this.transactDate = new Date().Format("yyyy-MM-dd");
      if(jQuery.fn.niceScroll) {
        $('.container-fluid').last().niceScroll({cursorcolor:'#7f7f7f'});
      }
    },
    show: function () {
      if(!window.app.loginV.model.get('name')) {
        console.error('No login information!');
        // route to /login
        app.redirectTo('/login');
        return;
      }
      var _this = this;
      if(!_this.accountVMs.length) {
        _this.loadArray(_this.accountVMs, window.app.addaccountV.model, false);
      }
      if(!_this.relativeVMs.length) {
        _this.loadArray(_this.relativeVMs, window.app.addrelativeV.model, true);
      }

      // 构造账号表
      _this.accountGridView = new kendo.View(gridAccountsTemplate, {
        wrap: false,
        model: kendo.observable({
          datasource: new kendo.data.DataSource({data: _this.accountVMs})
        })
      });
      _this.accountGridView.render('.grid-accounts');

      //构造受助人
      _this.relativeGridView = new kendo.View(gridRelativesTemplate, {
        wrap: false,
        model: kendo.observable({
          datasource: new kendo.data.DataSource({data: _this.relativeVMs})
        }),
        init: function() {
          var widget = this.element.find('[data-role=grid]').data('kendoGrid');
        }
      });
      _this.relativeGridView.render('.grid-relatives');
    },
    hide: function () {
      // 析构账号表
      if(!this.accountGridView) {return;}
      this.accountGridView.destroy();
      delete this.accountGridView;
      this.emptyArray(this.accountVMs);
      // 析构互助人表
      this.relativeGridView.destroy();
      delete this.relativeGridView;
      this.emptyArray(this.relativeVMs);
    },
    prevPage: function () {
      router.navigate("/addrelative");
    },
    loadArray: function(array, viewModels, addOrder) {
      var i,j=1, element, _this = this, formViews = viewModels.get('formViews'); 
      for(i=0; i<viewModels.get('formViewsIndex'); i++) {
        if(formViews[i]) {
          element = addOrder ?
            $.extend(true, {}, formViews[i].model, {
              order:j,
              // transactDate: _this.transactDate,
              validator: 0
            }) : $.extend(true, {}, formViews[i].model);
          delete element.validator;
          delete element.relations;
          delete element.disabled;
          delete element.index;
          // delete element.transactDate;
          array.push(element);
          j++;
        } // END OF if
      } // END OF for
    },
    emptyArray: function(array) {
      var i,length = array.length;
      for(i=0; i<length; i++) {
        array.pop();
      } // END OF for
    },
    submit: function (e) {
      var _this = this;
      e.preventDefault();

      var loginVM = window.app.loginV.model,
        agreementVM =window.app.agreementV.model;
        
      var config = window.app.proxy.checkinfo;
      // 使用ajax提交表单
      udesk.ajax({
        type: config.type,
        url: config.url, // TODO- 待修改为后端登录URL
        contentType: config.contentType,
        data: JSON.stringify({
          appId: loginVM.appId,
          data: {
            agreeWithUan: agreementVM.agreeWithUan,
            bindingCards: _this.accountVMs,
            // [{
            //   amt: _this.amt,
            //   bankOfDeposit: _this.bankOfDeposit,
            //   code: _this.code,
            //   customerInformation: _this.customerInformation,
            // }]
            customerInformation: _this.accountVMs[0].customerInformation,
            personnelRelationships: _this.relativeVMs,
            state: 'SIGNED',
            transactBank: '*',
            // transactDate: // 修改为只展示不提交 _this.transactDate
          },
          userId: loginVM.userId
        }),
      })
      .done(function(res) {
        // 登录返回成功，将返回的用户数据写入window.app.indexV.model
        if(res.statusCode == '200') {
          // var data = JSON.parse(res.data);

          // 跳转路由至 /agreement
          router.navigate("/result");
        }
        
      })
      .fail(function(jqXHR, textStatus, errorThrown) { 
        // TODO - 登录返回失败

      }); // END OF ajax
    },
  });

  // checkinfo视图view，从字符串变量checkinfoDomString中加载DOM结构，绑定ViewModel
  var checkinfoV = new kendo.View(checkinfoDomString, {
    wrap: false,
    model: checkinfoVM, 
    init: checkinfoVM.init.bind(checkinfoVM),
    show: checkinfoVM.show.bind(checkinfoVM),
    hide: checkinfoVM.hide.bind(checkinfoVM),
    prevPage: checkinfoVM.prevPage.bind(checkinfoVM),
    submit: checkinfoVM.submit.bind(checkinfoVM)
  });

  // checkinfo视图路由，渲染指定view
  router.route("/checkinfo", function () {
    layout.showIn(layoutSelector,checkinfoV, 'swap');
  });

    // 输出至全局变量app
    window.app = $.extend(true, app, {
      'checkinfoV': checkinfoV
    });

}));
