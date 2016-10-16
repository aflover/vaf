# vaf
promise flux library for vue and react

### install
```
npm i --save-dev vaf
```

### Vue useage
``` js
    import Vue from 'vue'
    import {Flux, FluxVue, mapGetters, mapActions} from 'vaf'
    Vue.use(FluxVue) // install plugin

    let flux = new Flux({
        strict: true // enable this for promise action to resolve data copy
    })
    flux.declare([...]) // declare you modules
    let app = new Vue({
        vaf: new FluxVue(flux),      // install 
        computed: mapGetters([...]), // map getters like vuex
        methods: mapActions([...]),  // map actions like vuex
    })
```

### declare modules
```js
    flux.declare({
        state: {
            todoList: []
        },
        mutations: {
            createNew ({todoList} = state, newItem) {
                todoList.push(newItem)
                return { todoList } // return updateState object if nessesary
            },
        },
        actions: {
            createTodo ({resolve, commit} = flux, title) {
                let newItem = {}
                newItem.title = title
                newItem.id = ++ _startIdx 
                newItem.isCompleted = false
                commit('createNew',  newItem)
                return resolve(newItem) // return promise if nessesary
            }
        }
    })
```

### Flux api
```js
    // for actions
    flux.declare({ actions: {
        myAction({
            // flux
            dispatch,
            commit,
            // promise api
            resolve,
            reject,
            then,
            all,
            cloneThen,
            // inject
            prop,
            // util
            clone,
            extend,
            flux, // self
            }, payload) {
            // can replace dispatch("doSomeAction", payload) below if has Proxy
            return dispatch.doSomeAction(payload).then((ret)=>{
                commit.doSomeMutation(ret)
                return resolve(ret) // 
            })
        }
    }})

    // inject plugins
    flux.use(({prop})=>{
        prop.val('storage', localStorage)
        // then use action({storage}, payload)=>{ storage.getItem(...) }
    })

    // events
    flux.on('update', (updateState)=>{
        for(var key in updateState)
            localStorage.setItem(key, JSON.stringify(updateState[key]))
        // easy to save state to localStorage
    })
    flux.on('replace', (state)=>{})
    flux.on('declare', (module)=>{ // do something after module declared 
    })

    // state
    flux.replaceState(newState)
    flux.getState() // return state copy
    flux.updateState(updateState)

```
