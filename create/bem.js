/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */
import { typeIs } from '../validate/type';

// 类名后缀
function gen(name, mods) {
  if (!mods) return '';
  if (typeIs('String', mods)) return ` ${name}--${mods}`;
  if (typeIs('Array', mods)) return mods.reduce((ret, item) => ret + gen(name, item), '');
  return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? gen(name, key) : ''), '');
}

// 创建类名前缀
export function createBEM(name) {
  return (el, mods) => {
    // 处理参数
    if (el && !typeIs('String', el)) {
      mods = el;
      el = '';
    }

    el = el ? `${name}__${el}` : name;
    return `${el}${gen(el, mods)}`;
  };
}
