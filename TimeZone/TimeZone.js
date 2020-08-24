/* =============================================================================
#     FileName: TimeZone.js
#         Desc: JS时区处理方法   
#      Version: 1.0.1
#   LastChange: 2020-08-24 09:39:16
============================================================================= */
(function(){
  var TimeZone = window.TimeZone || {};

  // 默认时间格式
  TimeZone.formatStr = 'YYYY/MM/DD hh:mm:ss';

  // 默认时区, 东8区
  TimeZone.timeZone = -8;

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
      timeZone = TimeZone.timeZone;
    }

    return Math.round((Math.floor((timestamp - timeZone * 60 * 60 * 1000)/(24 * 60 * 60 * 1000)) * 24 * 60 * 60 * 1000 + timeZone * 60 * 60 * 1000) / 1000);
  };

  /**
   * 将时间戳转换成指定时区的时间格式
   * @param { Number } timestamp, 时间戳，秒
   * @param { Number } timeZone, 时间 东区为负，西区为正，如东8区，-8，默认东8区
   * @param { String } formatStr, 时间格式 YYYY-MM-DD hh:mm:ss 区分大小写
   * @return { string } 时间格式
   */
  TimeZone.formatTimeStamp = function(timestamp, timeZone, formatStr) {
    // 转换成毫秒
    timestamp *= 1000;
    // 默认时间
    if(typeof timeZone === 'undefined'){
      timeZone = TimeZone.timeZone;
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
   * @param { String } formatStr, 时间格式 YYYY-MM-DD hh:mm:ss 区分大小写
   * @return { string } 时间格式
   */
  TimeZone.getDaysZeroList = function(startTimestamp, endTimestamp, timeZone, formatStr) {
    // 转换成毫秒
    endTimestamp *= 1000;
    // 默认时间
    if(typeof timeZone === 'undefined'){
      timeZone = TimeZone.timeZone;
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

  /**
   * 获取时间戳，指定时间里面的每周开始和结束零点时间戳
   * @param { Number } timestamp, 结束时间戳，秒
   * @param { Number } timeZone, 时间 东区为负，西区为正，如东8区，-8，默认东8区
   * @param { Boolean } isMonday, 星期一是否是一天开始
   * @param { Number } weekNum, 获取的周数
   * @param { String } formatStr, 时间格式 YYYY-MM-DD hh:mm:ss 区分大小写
   * @return { string } 时间格式
   */
  TimeZone.getWeekTimestamp = function(timestamp, timeZone, isMonday, weekNum, formatStr) {
    // 默认时间
    if(typeof timeZone === 'undefined'){
      timeZone = TimeZone.timeZone;
    }
    // 获取零点时间
    timestamp = TimeZone.getZeroByTimestamp(timestamp, timeZone);

    // 周数
    if(typeof weekNum === 'undefined'){
      weekNum = 1;
    }

    // 默认格式
    formatStr = formatStr || TimeZone.formatStr;

    // 时间转换
    var utcTimestamp = timestamp - timeZone * 60 * 60;
    // 获取当天星期几，默认星期日为0
    var day = new Date(utcTimestamp * 1000).getUTCDay();
    var weeks = [];
    var startTimestamp = 0; // 开始时间

    // 如果是从星期一开始
    if(isMonday){
      day = day === 0 ? 7 : day;
      startTimestamp = timestamp - 86400 * (day - 1);
    } else {
      day = day === 0 ? 0 : day;
      startTimestamp = timestamp - 86400 * day;
    }

    for(var i = 0; i < weekNum; i++){
      var tmpStartTimestamp = startTimestamp - 86400 * 7 * i; // 按周递减
      var endTimestamp = tmpStartTimestamp + 86400 * 7 - 1; // 加一周时间
      var item = {
        startTimestamp: tmpStartTimestamp,
        endTimestamp: endTimestamp,
        startTimestampStr: TimeZone.formatTimeStamp(tmpStartTimestamp, timeZone, formatStr),
        endTimestampStr: TimeZone.formatTimeStamp(endTimestamp, timeZone, formatStr)
      }
      weeks.push(item);
    }

    return weeks;
  };

  window.TimeZone = TimeZone;
})();
