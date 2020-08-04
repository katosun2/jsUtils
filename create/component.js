import { typeIs } from '../validate/type';
import { camelize } from '../format/string';
import { SlotsMixin } from '../../mixins/slots';
import Vue from 'vue';

// 注册
function install(Vue) {
  const { name } = this;
  Vue.component(name, this);
  Vue.component(camelize(`-${name}`), this);
}

// 插槽继承
function unifySlots(ctx) {
  // 访问作用域插槽
  const scopedSlots = ctx.scopedSlots || ctx.data.scopedSlots || {};
  // 访问被插槽分发的内容
  const slots = ctx.slots();
  Object.keys(slots).forEach(key => {
    if (!scopedSlots[key]) scopedSlots[key] = function () { return slots[key]; };
  });
  return scopedSlots;
}

// 函数式组件转换
function transformFunctionComponent(pure) {
  return {
    functional: true,
    props: pure.props,
    model: pure.model,
    render: (h, ctx) => {
      return pure(h, ctx.props, unifySlots(ctx), ctx);
    }
  };
}

// 创建组件函数
export function createComponent(name) {
  return function (sfc) {
    if (typeIs('Function', sfc)) sfc = transformFunctionComponent(sfc);
    // 合并继承mixins
    if (!sfc.functional) {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(SlotsMixin);
    }
    sfc.name = name;
    sfc.install = install;
    return sfc;
  };
}
