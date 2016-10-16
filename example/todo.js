
let _startIdx = 0

export default {
	state: {
		todoList: [],
	},
	mutations: {
		createNew ({todoList}, newItem) {
			todoList.push(newItem);
			return { todoList }
		},
		toggleCompleted ({todoList}, todo) {
			for (var i= 0, l = todoList.length; i < l ; ++ i) {
				if (todoList[i].id == todo.id) {
					var it = todoList[i];
					if (it.isCompleted == todo.isCompleted) {
						it.isCompleted = !todo.isCompleted;
						return { todoList }
					}
				}
			}
		},
		removeItemById ({todoList}, id) {
			for (var i= todoList.length -1; i >=0 ; --i) {
				if (todoList[i].id == id) {
					todoList.splice(i, 1);
					return { todoList }
				}
			}
		},
	},
	actions: {
		createNew ({resolve, commit}, title) {
			var newItem = {};
			newItem.title = title;
			newItem.id = ++ _startIdx ;
			newItem.isCompleted = false;
			commit('createNew',  newItem)
			return resolve(newItem);
		},
	}
}