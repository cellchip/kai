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
 *  index.js
 *  功能       ATM首页视图
 *  作者       LIU Jiajie
 *  日期       2018-09-xx
 *  当前路由 /
 *  前一路由 无
 *  后一路由 /login
 *  输出变量  window.app, indexV
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
    var kendo = window.kendo;
    
    // 构造布局DOM模板
    var layoutDomTemplate = ' <header>\
      <div class="header-left"></div><div class="header-right"></div>\
    </header>\
    <section id="content"></section>\
    <footer class="webside">\
      欢迎光临中国农业银行  www.*.com\
    </footer>',
      layoutSelector = '#content',
      rootSelector = '#app';
    
    // 使用template构造DOM字符串，传入从上一视图读取的变量
    var layoutDomString = kendo.template(layoutDomTemplate)({
      
    
     });
  
    var rt = new kendo.Router({
      routeMissing: function(e) {
        console.error('路由"', e.url, '"不存在，跳转至默认路由 "/" ...');
        // e.sender.navigate('/');
        // 路由重定向至 /
        window.app.redirectTo();
      }
    });
    rt.bind('init', function () {
      layout.render($(rootSelector));
    });
  
    // 输出至全局变量app
    window.app = $.extend(true, window.app || {}, {
      layout: new kendo.Layout(layoutDomString),
      layoutSelector: layoutSelector,
      router: rt,
      proxy: {
    	  faceidLogin : {
				// 对应login.js，发送登录请求，返回签约合同
				type : 'POST',
				url : getPath()+'api/rest/cusinf/faceID', // TODO - 待修改为后端刷脸登录URL
				contentType : 'application/json',
			},
			withdraw : {
				// 对应withCheckInfo.js，发送本行账户请求，返回账户信息
				type : 'POST',
				url : getPath()+'api/rest/cusinf/withdraw', // TODO -
				// 待修改为后端取款URL
				contentType : 'application/json',
			},
			findMasters : {
				// 对应queryrelativelist.js，发送户主身份证信息，返回受助人列表
				type : 'POST',
				url : getPath()+'api/rest/uancon/findMasters', // TODO-
														// 待修改为后端帮助人列表URL
				contentType : 'application/json',
			},
			inquireAssets : {
				// 对应checkinfo.js，发送签约账户和互助人信息，返回签约结果
				type : 'POST',
				url : getPath()+'api/rest/cusinf/inquireAssets', // TODO-
				// 待修改为后端某帮助人的资产情况（卡列表）URL
				contentType : 'application/json',
			},
			findByIdCard : {
				// 对应checkinfo.js，发送签约账户和互助人信息，返回签约结果
				type : 'POST',
				url : getPath()+'api/rest/uancon/findBindingCards', // TODO-
				// 待修改为后端某帮助人的卡列表URL
				contentType : 'application/json',
			},
			reportLoss : {
				// 对应checkinfo.js，发送签约账户和互助人信息，返回签约结果
				type : 'POST',
				url : getPath()+'api/rest/cusinf/reportLoss', // TODO-
													// 待修改为后端挂失卡URL
				contentType : 'application/json',
			},
      },
      redirectTo: function(path) {
        window.location.href = window.location.href.split('#')[0] + '#' + (path || '/');
      }
    });
  
  
  
    // 构造index页面
    var app = window.app,
      layout = app.layout,
      router = app.router,
      layoutSelector = app.layoutSelector;
  
    // 构造视图DOM模板
    var indexDomTemplate = '<a class="atm-btn btn-right btn-bg btn-row-3" data-bind="click: nextPage">\
      <span class="zh-CN">UAN应急服务</span>\
      <span class="en-US">UAN Emergency Service</span>\
    </a>\
    <div class="container-fluid no-logo" style="bottom: 80px;">\
      <div class="ad"><img src="image/green-shield.jpg"/></div>\
      <div class="index-instruction">\
        <div>欢迎您使用中国农业银行<br>\
          自动柜员机<br>\
          请插入银行卡或刷存折\
        </div>\
        <div style="font-size: 15px;">Welcome to the ATM system<br>\
          of Agriculture Bank of China<br>\
          PLEASE INSERT CARD\
        </div>\
        <div class="card-image"><img src="image/card/card.png"/></div>\
      </div>\
    </div>\
    <footer class="index">\
      <div class="footer-upper">\
        <img src="image/card/unionPay.png"/>\
        <img src="image/card/visa1.png"/>\
        <img src="image/card/visa2.png"/>\
        <img src="image/card/plus.png"/>\
        <img src="image/card/masterCard.png"/>\
        <img src="image/card/maestro.png"/>\
        <img src="image/card/cirrus.png"/>\
      </div>\
      <div class="footer-left">www.*.com</div>\
      <div class="footer-middle">NO.18010101 SOFTVER:V10.0.0.0</div>\
      <div class="footer-right"></div>\
    </footer>';
  
    // 使用template构造DOM字符串，传入从上一视图读取的变量
    var indexDomString = kendo.template(indexDomTemplate) ({});  
  
    // index视图view modal
    var indexVM = kendo.observable({
      init: function () {
      },
      // show: function () {
      // },
      // hide: function () {
      // },
      nextPage: function() {
        // 跳转路由至 /login
        router.navigate('/faceidlogin');
      },
    });
  
    // index视图view，从字符串变量indexDomString中加载DOM结构，绑定ViewModel
    var indexV = new kendo.View(indexDomString, {
      model: indexVM,
      // init: indexVM.init.bind(indexVM),
      // show: indexVM.show.bind(indexVM),
      // hide: indexVM.hide.bind(indexVM),
      nextPage: indexVM.nextPage.bind(indexVM),
    });
  
    // deposit视图路由，渲染指定view
    router.route('/', function () {
      layout.showIn(layoutSelector, indexV);
    });
  
    // 输出至全局变量app
    window.app = $.extend(true, app, {
      'indexV': indexV
    });
  }));
