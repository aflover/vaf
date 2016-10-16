
function resetStoreVM (Vue, flux, vaf, state) {
    let oldVm = vaf.vm
    if (oldVm) {
        flux.off('update', vaf.watch)
    }
    const silent = Vue.config.silent
    Vue.config.silent = true
    let vm = vaf.vm = new Vue({ data: {state} })
    flux.on('update', vaf.watch = (newState) => {
        for (var key in newState) {
            vm.state[key] = newState[key]
        }
    })
    Vue.config.silent = silent
    if (oldVm) {
        oldVm.state = null;
        Vue.nextTick(() => oldVm.$destroy())
    }
}

let Vue

export function FluxVue(flux) {
    let vaf = {
        dispatch: flux.dispatch,
    }
    resetStoreVM(Vue, flux, vaf, flux.getState())
    flux.on('replace', (state)=>{
        resetStoreVM(Vue, flux, vaf, state)
    })
    return vaf
}

FluxVue.install = function install(vue) {
    Vue = vue;
    Vue.mixin({
        beforeCreate () {
            const options = this.$options
            if (options.vaf) {
                this.$vaf = options.vaf
            } else if (options.parent && options.parent.$vaf) {
                this.$vaf = options.parent.$vaf
            }
        }
    });
}

export function mapGetters(getters) {
    var res = {}
    normalizeMap(getters).forEach(function(ref) {
        var key = ref.key;
        var val = ref.val;
        res[key] = isFunction(val) ? function mappedGetter() { // function(state){}
            return val.call(this, this.$vaf.vm.state);
        } : function mappedGetter() {
            return this.$vaf.vm.state[val];
        }
    })
    return res;
}

export function mapActions(actions) {
    var res = {}
    normalizeMap(actions).forEach(function mappedAction(ref) {
        var key = ref.key;
        var val = ref.val;
        res[key] = function mappedAction(payload) {
            return this.$vaf.dispatch(val, payload);
        }
    })
    return res;
}

function normalizeMap(map) {
    return Array.isArray(map) ? map.map(key => {
        return {
            key: key,
            val: key
        };
    }) : Object.keys(map).map(key => {
        return {
            key: key,
            val: map[key]
        };
    });
}

function isFunction(fn) {
    return typeof fn ==='function'
}
