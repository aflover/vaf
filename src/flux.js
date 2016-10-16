import initEvent from './event'
import extend from './extend'
import clone from './clone'

export function Flux (opts = {strict: true}){
	let flux = this
	let prop = initProp(flux)
	let {val} = prop
	val('flux', flux)
	val('prop', prop)
	val('_mutations', {});
	val('_actions', {});
	val('_opts', opts);
	initUse(flux)([initUtil, initEvent, initPromise, initCloneThen, 
		initState, initCommit, initDispatch, 
		initDeclare])
}

function initProp (flux) {
	return {
		get (key, val, opts={}) {
			opts.get = val;
			Object.defineProperty(flux, key, opts);
		},
		val (key, val, opts={}) {
			opts.value = val;
			Object.defineProperty(flux, key, opts);
		}
	}
}

function initUse ({flux, prop}) {
	let use = (plugin, opts) => {
		if (Array.isArray(plugin)) {
			return plugin.forEach(plugin => {
				flux.use(plugin, opts)
			})
		}
		plugin(flux, opts)
	}
	prop.val('use', use)
	return use
}

function initUtil({prop}) {
	prop.val('clone', clone)
	prop.val('extend', extend)
}

function initState({prop, emit, cloneThen, clone}) {
	let state = {}
	prop.get('state', ()=> state,{
		set () {
			throw new Error('[flux] Use flux.replaceState() to explicit replace store state.')
		}
	})
	prop.val('getState', ()=> clone(state))

	prop.val('replaceState', newState => {
		let oldState = state
		state = newState
		cloneThen(newState).then(cloneState => {
			emit('replace', cloneState)
		})
	})
	
	prop.val('updateState', (updateState, slice) => {
		if (typeof updateState != 'object') {
			throw new Error('[flux] updateState require new state as object')
		}
		if (updateState != state) {
			Object.keys(updateState).map(key => {
				state[key] = updateState[key]
			})
		}
		if (!slice) {
			cloneThen(updateState).then(cloneState => {
				emit('update', cloneState)
			})
		}
	})

}

function initCommit({prop, flux, updateState}) {
	let commit = (type, payload) => {
		let {_mutations} = flux
		if (typeof type === 'object') {
			payload = type
			type = type.type
		}
		var entry = _mutations[type];
		if (!entry) {
		    throw new Error("[flux] unknown mutation : " + type);
		}
		let state = flux.state
		let ret = entry(state, payload)
		if (ret) {
			if (ret === state) {
				throw new Error('[flux] commit require new object rather than old state')
			}
			if (typeof ret != 'object') {
				throw new Error('[flux] commit require new object')
			}
			flux.updateState(ret)
		}
	}
	prop.val('commit', proxyApi(commit))
}

function initDispatch({prop, flux, commit, resolve, reject, _opts, cloneThen}) {
	let dispatch = (action, payload) => {
		let {_actions, _mutations} = flux
		let entry = action in _actions && _actions[action] 
			|| action in _mutations && function (_, payload) {
                commit(action, payload);
                return resolve();
            }
        if (!entry) {
            return reject("[flux] unknown action : " + action);
        }
        let err, ret
        try {
            ret = entry(flux, payload);
        } catch (e) {
            err = e;
        }
        if (err) {
        	return reject(err)
        }
        if (!isPromiseLike(ret)) {
        	ret = resolve(ret)
        }
        // make copy
        return _opts.strict ? ret.then(data => {
        	if (Array.isArray(data) || typeof data ==='object') {
        		if (data.__clone) {
        			return resolve(data);
        		}
        		return cloneThen(data).then(newData => {
        			Object.defineProperty(newData, '__clone', {value: true});
        			return resolve(newData);
        		})
        	}
        	return resolve(data)
        }) : ret
	}
	prop.val('dispatch', proxyApi(dispatch))
}

function isPromiseLike(ret) {
	return ret && ret.then
}

function initDeclare({prop, flux, emit}) {
	let declare = (mod) => {
		if (!mod)
			return
		if (Array.isArray(mod))
			return mod.forEach(declare)
		if (mod.mutations) {
			for(var mutation in mod.mutations) {
				flux._mutations[mutation] = mod.mutations[mutation]
			}
		}
		if (mod.actions) {
			for(var action in mod.actions) {
				flux._actions[action] = mod.actions[action]
			}
		}
		if (mod.state) {
			flux.updateState(mod.state, true)
		}
		emit('declare', mod)
	}
	prop.val('declare', declare)
}

function proxyApi(entry) {
	if (typeof Proxy != 'undefined') {
		return new Proxy(entry, {
	        get (target, name) {
	            return payload=> {
	                return entry(name, payload);
	            }
	        }
	    })
	}
	return entry
}

function initPromise({prop}) {
	let PROMISE = Promise
	prop.val('resolve', PROMISE.resolve.bind(PROMISE))
	prop.val('reject', PROMISE.reject.bind(PROMISE))
	prop.val('all', PROMISE.all.bind(PROMISE))
	prop.val('then', fn => {
	    return new PROMISE(fn)
	})
}

function initCloneThen({prop}) {
	const channel = new MessageChannel()
	let maps = {}, 
		idx = 0, 
		port1 = channel.port1 , 
		port2 = channel.port2 
    port2.start()
    port2.onmessage = ({data: {key, value}}) => {
        const resolve = maps[key]
        resolve(value)
        delete maps[key]
    }
    prop.val('cloneThen', value => {
		return new Promise(resolve => {
		    const key = idx++
		    maps[key] = resolve
		    channel.port1.postMessage({key, value})
		})
	})
}
