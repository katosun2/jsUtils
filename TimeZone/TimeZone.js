/* =============================================================================
#     FileName: TimeZone.js
#         Desc: JS时区处理方法   
#      Version: 1.0.0
#   LastChange: 2020-08-22 16:52:03
============================================================================= */
(function(){
  var TimeZone = window.TimeZone || {};

  // 默认时间格式
  TimeZone.formatStr = 'YYYY/MM/DD hh:mm:ss';

  /**
   * 获取本地时区
   * @return { Number } 时间，东区为负，西区为正
   */
  TimeZone.getTimeZone = function(){
    var currentZoneTime = new Date();
    // 本地时区
    var offsetZone = currentZoneTime.getTimezoneOffset() / 60;

    return offsetZone;
  };

  /**
   * 通过时间戳获取指定时区当天的零点时间戳
   * @param { Number } timestamp, 时间戳，秒
   * @param { Number } timeZone, 时间 东区为负，西区为正，如东8区，-8，默认东8区
   * @return { Number } 时间戳
   */
  TimeZone.getZeroByTimestamp = function(timestamp, timeZone){
    // 转换成毫秒
    timestamp *= 1000;
    // 默认时间
    if(typeof timeZone === 'undefined'){
      timeZone = -8;
    }

    var d = new Date(timestamp);
    // 将时分秒毫秒设为0
    d.setUTCHours(timeZone);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);

    return Math.round(d / 1000);
  };

  /**
   * 将时间戳转换成指定时区的时间格式
   * @param { Number } timestamp, 时间戳，秒
   * @param { Number } timeZone, 时间 东区为负，西区为正，如东8区，-8，默认东8区
   * @param { String } formatStr, 时间格式 YYYY-MM-DD hh:mm:ss
   * @return { string } 时间格式
   */
  TimeZone.formatTimeStamp = function(timestamp, timeZone, formatStr) {
    // 转换成毫秒
    timestamp *= 1000;
    // 默认时间
    if(typeof timeZone === 'undefined'){
      timeZone = -8;
    }
    // 默认格式
    formatStr = formatStr || TimeZone.formatStr;

    // 取反
    timeZone = -timeZone;
    // 计算时区偏差值
    timestamp += timeZone * 60 * 60 * 1000;

    var d = new Date(timestamp);
    var z = {
      M: d.getUTCMonth() + 1,
      D: d.getUTCDate(),
      d: d.getUTCDate(),
      H: d.getUTCHours(),
      h: d.getUTCHours(),
      m: d.getUTCMinutes(),
      s: d.getUTCSeconds()
    };

    // 格式化
    formatStr = formatStr.replace(/(M+|D+|d+|H+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
    });
    formatStr = formatStr.replace(/(Y+|y+)/g, function(v) {
      return d.getUTCFullYear().toString().slice(-v.length);
    });

    return formatStr;
  };

  /**
   * 获取指定时区, 两个时间戳范围每天的零点时间戳
   * @param { Number } startTimestamp, 开始时间戳，秒
   * @param { Number } endTimestamp, 结束时间戳，秒
   * @param { Number } timeZone, 时间 东区为负，西区为正，如东8区，-8，默认东8区
   * @param { String } formatStr, 时间格式 YYYY-MM-DD hh:mm:ss
   * @return { string } 时间格式
   */
  TimeZone.getDaysZeroList = function(startTimestamp, endTimestamp, timeZone, formatStr) {
    // 转换成毫秒
    endTimestamp *= 1000;
    // 默认时间
    if(typeof timeZone === 'undefined'){
      timeZone = -8;
    }
    // 默认格式
    formatStr = formatStr || TimeZone.formatStr;

    var daysZeroList = [];
    // 获取指定时间, 0点时间戳
    var startTimestamp = TimeZone.getZeroByTimestamp(startTimestamp, timeZone) * 1000;

    // 以天为步长获取对应的时间戳
    while(startTimestamp <= endTimestamp){
      daysZeroList.push({
        timestamp: Math.round(startTimestamp / 1000),
        timeStr: TimeZone.formatTimeStamp(Math.round(startTimestamp / 1000), timeZone, formatStr)
      });
      startTimestamp += 24 * 60 * 60 * 1000;
    }

    return daysZeroList;
  };

  window.TimeZone = TimeZone;
})();
