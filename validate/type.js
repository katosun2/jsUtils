/**
 *
 * @param {String, Number, Boolean, Null, Undefined, Symbol, Object} type 判断类型
 * @param {*} data 判断数据
 */
export function typeIs(type, data) {
  type = type.charAt(0).toUpperCase() + type.slice(1);
  return Object.prototype.toString.call(data) === `[object ${type}]`;
}

// 是否有默认值
export function isDef(val) {
  return val !== undefined && val !== null;
}
