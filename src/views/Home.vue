<template>
    <section v-cloak class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input
                v-model="newTodo"
                v-focus
                class="new-todo"
                autocomplete="off"
                placeholder="What needs to be done?"
                @keyup.enter="onEnter"
            >
        </header>
        <section class="main">
            <input
                id="toggle-all"
                class="toggle-all"
                type="checkbox"
                @change="toggleAll"
            >
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                <li v-for="todo in todos" :key="todo.id" :class="['todo', { completed: todo.done }, { editing: editingId === todo.id }]">
                    <div class="view">
                        <input
                            class="toggle"
                            type="checkbox"
                            :checked="todo.done"
                            @change="changeHandler(todo)"
                        >
                        <label @dblclick="editingId = todo.id">{{ todo.text }}</label>
                        <button class="destroy" @click="deleteHandler(todo)" />
                    </div>
                    <input
                        v-focus="editingId === todo.id"
                        class="edit"
                        type="text"
                        :value="todo.text"
                        @blur="editHandler(todo)"
                        @keyup.enter="editHandler(todo)"
                        @keyup.esc="editingId = ''"
                    >
                </li>
            </ul>
        </section>
        <footer class="footer">
            <span class="todo-count">
                <strong>{{ todos.length }}</strong> item left
            </span>
            <ul class="filters">
                <li>
                    <router-link to="/all" :class="{ selected: filter === 'all' }">
                        All
                    </router-link>
                </li>
                <li>
                    <router-link to="/active" :class="{ selected: filter === 'active' }">
                        Active
                    </router-link>
                </li>
                <li>
                    <router-link to="/completed" :class="{ selected: filter === 'completed' }">
                        Completed
                    </router-link>
                </li>
            </ul>
            <button class="clear-completed" @click="deleteCompleted">
                Clear completed
            </button>
        </footer>
    </section>
    <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Written by <a href="http://evanyou.me">Evan You</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
</template>

<script>
import { onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
    name: 'Home',
    setup () {
        const store = useStore();
        const route = useRoute();

        // create
        const newTodo = ref('');
        const onEnter = async () => {
            await store.dispatch('createTodo', {
                id: Date.now(),
                text: newTodo.value.trim(),
                done: false
            });
            newTodo.value = '';
        };

        // read
        const filter = computed(() => route.params.filter || 'all');
        const todos = computed(() => {
            let list = [];
            switch (filter.value) {
            case 'all':
                list = store.state.todos;
                break;
            case 'active':
                list = store.getters.activeTodos;
                break;
            case 'completed':
                list = store.getters.completedTodos;
                break;
            default:
                break;
            }
            return list;
        });

        // update
        const editingId = ref('');
        const changeHandler = async ({ id, text }) => {
            await store.dispatch('updateTodo', {
                id,
                text,
                done: event.target.checked
            });
        };
        const editHandler = async ({ id, done }) => {
            if (!editingId.value) return;

            if (!event.target.value.trim()) {
                deleteHandler({ id });
            }

            await store.dispatch('updateTodo', {
                id,
                text: event.target.value.trim(),
                done
            });
            editingId.value = '';
        };
        const toggleAll = async () => {
            // 如全勾選時全反選，否則全選
            const doneCount = todos.value.reduce((previous, current) => previous + current.done, 0);
            const done = !(doneCount === todos.value.length);

            const newTodos = todos.value.map(({ id, text }) => ({ id, text, done }));
            await store.dispatch('updateTodos', newTodos);
        };

        // delete
        const deleteHandler = async todo => {
            await store.dispatch('deleteTodo', todo);
        };
        const deleteCompleted = async () => {
            await store.dispatch('deleteCompleted');
        };

        onMounted(async () => {
            await store.dispatch('readTodos');
        });

        return {
            newTodo,
            onEnter,
            filter,
            todos,
            editingId,
            changeHandler,
            editHandler,
            deleteHandler,
            toggleAll,
            deleteCompleted
        };
    }
};
</script>
