import { isNaN } from './number';
import { typeIs } from '../';

export function isDate(val) {
  return (
    typeIs('Date', val) &&
    !isNaN(val.getTime())
  );
}
