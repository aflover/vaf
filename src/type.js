
function toStringType(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
}

export function isNumber(arg) {
    return typeof arg === 'number' && !isNaN(arg);
}

export const isArray = Array.isArray

export function isBoolean(arg) {
	return typeof arg === 'boolean'
}

export function isString(arg) {
	return typeof arg === 'string'
}

export function isFunction(arg) {
	return typeof arg === 'function'
}

export function isObject(arg) {
	return (toStringType(arg) == 'Object') && (arg !== null);
}