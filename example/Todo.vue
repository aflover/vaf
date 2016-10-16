<template>
	<div>
		TODO LIST
		<ul>
			<li v-for="child in todoList">
          		<label>
              		<input type="checkbox" :checked="child.isCompleted" @change="toggleCompleted(child)"/>
              		<span>{{child.title}}</span>
          		</label>
              	<button @click="removeItemById(child.id)">x</button>
			</li>
		</ul>
		<input type="text" v-model="newText"/> <button @click="createNew(newText)">Add</button>
	</div>
</template>

<script type="text/javascript">
	import {mapGetters, mapActions} from 'vaf'

	export default {
		computed: mapGetters([
			'todoList'
		]),
		data: function () {
			return {
				newText: ''
			}
		},
		methods: mapActions([
			'createNew',
			'toggleCompleted',
			'removeItemById',
		]),
		mounted () {
			window.todovm = this
		}
	}
</script>