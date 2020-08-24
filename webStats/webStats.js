/*! 
 * web 性能统计
 * Usage: WEBSTATS.getWebInfo(callback(data));
 * Version: 1.1.2
 **/

(function(){
  var WEBSTATS = {};
  var timer = {};

  // 性能api
  WEBSTATS.performance = window.performance || window.webkitPerformance || window.msPerformance;
  WEBSTATS.isReady = false;
  WEBSTATS.cacheFn = [];
  // 默认性能数据
  WEBSTATS.performanceData = {
    unit: 'ms', // 毫秒
    system: '',
    ua: '',
    url: '',
    loadPage: 0, // 页面加载完成的时间，几乎等于用户等待页面可用的时间
    domReady: 0, // 解析 DOM 树结构时间，DOM 树是否嵌套太多层
    redirect: 0, // 重定向的时间，应该拒绝重定向
    lookupDomain: 0, // DNS 查询时间，DNS需要做预加载，域名过多
    TTFB: 0, // 读取页面第一个字节时间，用户拿到资源占用的时间，和CDN，宽带，CPU运算有关
    request: 0, // 网络内容加载完成的时间（未渲染）
    loadEvent: 0, // 执行到 onload 回调函数的时间
    appcache: 0, // DNS 缓存时间
    unloadEvent: 0, // 卸载页面的时间
    network: 0, // 整个网络耗时，从输入网址开始
    domActive: 0, // DOM 可交互的耗时
    blank: 0, // 白屏时间, 网络开始到读取第一个字符时间
    tcp: 0, // TCP 建立连接完成握手时间
    tcpSSL: 0, // TCP 建立连接完成握手时间
    total: 0, // 总时长
    resource: [] // 资源加载列表
  };

  // 获取资源统计指标
  WEBSTATS.getResourceInfo = function (resource) {
    var resourceList = []; 

    for(var i = 0; i < resource.length; i++){
      var item = resource[i];
      var url = new URL(item.name);
      var tmpItem = {};

      tmpItem = {
        name: url.pathname,
        fetchStart: item.fetchStart,
        href: url.href,
        type: item.initiatorType, // 类型
        duration: item.duration // 时长
      };

      // 传输大小
      if(typeof item.transferSize !== 'undefined'){
        tmpItem.size = item.transferSize / 1024 + 'KB'; 
      }

      resourceList.push(tmpItem);
    }

    // 排序
    resourceList = resourceList.sort(function(a, b) {
      return b.duration - a.duration;
    });

    return resourceList;
  };

  // 获取性能指标
  WEBSTATS.getWebInfo = function (callback) {
    if(!WEBSTATS.isReady){
      WEBSTATS.cacheFn.push(callback);
      // 等待初始化
      return WEBSTATS.ready();
    }

    var ua = navigator.userAgent;
    // device & system
    var ipod = ua.match(/(ipod).*\s([\d_]+)/i),
      ipad = ua.match(/(ipad).*\s([\d_]+)/i),
      iphone = ua.match(/(iphone)\sos\s([\d_]+)/i),
      android = ua.match(/(android)\s([\d\.]+)/i);
    var logMsg = 'Unknown',
      templogMsg = '';
    var data = WEBSTATS.performanceData;

    if (android) {
      logMsg = 'Android ' + android[2];
    } else if (iphone) {
      logMsg = 'iPhone, iOS ' + iphone[2].replace(/_/g,'.');
    } else if (ipad) {
      logMsg = 'iPad, iOS ' + ipad[2].replace(/_/g, '.');
    } else if (ipod) {
      logMsg = 'iPod, iOS ' + ipod[2].replace(/_/g, '.');
    }

    templogMsg = logMsg;

    // wechat client version
    var version = ua.match(/MicroMessenger\/([\d\.]+)/i);
    if (version && version[1]) {
      logMsg = version[1];
      templogMsg += (', WeChat ' + logMsg);
    }
    // 系统环境
    data.ua = ua;
    data.system = templogMsg;
    data.url = window.location.href;

    // 性能指标
    var performance = WEBSTATS.performance;
    if (performance) {
      var t = performance.timing;
      if (t.loadEventEnd > 0) {

        // 内容加载完成时间
        if(t.loadEventEnd && t.navigationStart){
          data.loadPage = t.loadEventEnd - t.navigationStart;
        }

        // 解析 DOM 树结构时间，DOM 树是否嵌套太多层
        if(t.domComplete && t.responseEnd){
          data.domReady = t.domComplete - t.responseEnd;
        }

        // 重定向的时间，应该拒绝重定向
        if(t.redirectEnd && t.redirectStart){
          data.redirect = t.redirectEnd - t.redirectStart;
        }

        // DNS 查询耗时
        if(t.domainLookupEnd && t.domainLookupStart){
          data.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
        }

        // 读取页面第一个字字的时间
        // TTFB 即 Time To First Byte 的意思
        // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
        if(t.responseStart && t.navigationStart){
          data.TTFB = t.responseStart - t.navigationStart;
        }

        // 网络内容加载完成的时间（未渲染）
        if(t.responseEnd && t.responseStart) {
          data.request = t.responseEnd - t.responseStart;
        }

        // 执行到 onload 回调函数耗时
        if(t.loadEventEnd && t.loadEventStart){
          data.loadEvent = t.loadEventEnd - t.loadEventStart;
        }

        // DNS 缓存时间
        if(t.domainLookupStart && t.fetchStart){
          data.appcache = Math.max(t.domainLookupStart - t.fetchStart, 0);
        }

        // 卸载页面的时间
        if(t.unloadEventEnd && t.unloadEventStart){
          data.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
        }

        // 整个网络耗时，从输入网址开始
        if(t.responseEnd && t.navigationStart){
          data.network = t.responseEnd - t.navigationStart;
        }

        // DOM可交互耗时
        if(t.domInteractive && t.navigationStart){
          data.domActive = t.domInteractive - t.navigationStart;
        }

        // 白屏时间, 网络开始到读取第一个字符时间
        if(t.responseEnd && t.navigationStart){
          data.blank = t.responseEnd - t.navigationStart;
        }

        // TCP 链接耗时
        if (t.connectEnd && t.connectStart) {
          // TCP 链接中ssl耗时
          if (t.connectEnd && t.secureConnectionStart) {
            data.tcpSSL = t.connectEnd - t.secureConnectionStart;
          }
          data.tcp = t.connectEnd - t.connectStart;
        }

        // 总耗时
        if((t.loadEventEnd || t.loadEventStart || t.domComplete || t.domLoading) && t.navigationStart){
          data.total = (t.loadEventEnd || t.loadEventStart || t.domComplete || t.domLoading) - t.navigationStart;
        }

        // 加载的资源
        if(performance.getEntriesByType){
          data.resource = performance.getEntriesByType('resource');
          // 获取资源性能提标
          data.resourceFormat = WEBSTATS.getResourceInfo(data.resource);
        }

        data.timing = t;
      };
    }

    callback && callback(data);
  };

  // 等待执行
  WEBSTATS.ready = function (callback) {
    clearInterval(timer);
    timer = setInterval(function() {
      if(WEBSTATS.performance.timing.loadEventEnd > 0){
        clearInterval(timer);
        WEBSTATS.isReady = true;
        WEBSTATS.getWebInfo(function(data){
          for(var i = 0; i < WEBSTATS.cacheFn.length; i++){
            var fn = WEBSTATS.cacheFn[i];
            fn && fn(data);
          }
          // 置空
          WEBSTATS.cacheFn = [];
        });
      }
    }, 100);
  }

  window.WEBSTATS = WEBSTATS;
})();
