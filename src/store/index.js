import { createStore } from 'vuex';
import LS from '@/modules/LocalStorage';

export default createStore({
    state: {
        todos: []
    },
    getters: {
        activeTodos (state) {
            return state.todos.filter(todo => todo.done === false);
        },
        completedTodos (state) {
            return state.todos.filter(todo => todo.done === true);
        }
    },
    mutations: {
        setTodos (state, todos) {
            state.todos = todos;
        }
    },
    actions: {
        createTodo ({ commit }, todo) {
            const todos = LS.get('todos');
            todos.push(todo);
            LS.set('todos', todos);
            commit('setTodos', todos);
            return todo;
        },
        readTodos ({ commit }) {
            const todos = LS.get('todos');
            commit('setTodos', todos);
            return todos;
        },
        updateTodo ({ commit }, { id, text, done }) {
            const todos = LS.get('todos');
            todos.forEach(item => {
                if (item.id === id) {
                    item.text = text;
                    item.done = done;
                }
            });
            LS.set('todos', todos);
            commit('setTodos', todos);
            return todos.find(item => item.id === id);
        },
        updateTodos ({ commit }, todos) {
            LS.set('todos', todos);
            commit('setTodos', todos);
            return todos;
        },
        deleteTodo ({ commit }, { id }) {
            const todos = LS.get('todos');
            const index = todos.findIndex(item => item.id === id);
            if (index === -1) return;
            const deletedTodo = todos.splice(index, 1);
            LS.set('todos', todos);
            commit('setTodos', todos);
            return deletedTodo[0];
        },
        deleteCompleted ({ commit }) {
            const todos = LS.get('todos');
            const newTodos = todos.filter(todo => todo.done === false);
            LS.set('todos', newTodos);
            commit('setTodos', newTodos);
            return newTodos;
        }
    }
});
