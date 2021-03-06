import store from '@/store';

describe('test store', () => {
    const id = new Date().getTime();
    const createdTodo = {
        id,
        text: 'test',
        done: false
    };
    const updatedTodo = {
        id,
        text: 'update test',
        done: true
    };
    it('create todo', async () => {
        const result = await store.dispatch('createTodo', createdTodo);
        expect(result).toStrictEqual(createdTodo);
    });
    it('read todos', async () => {
        const result = await store.dispatch('readTodos');
        expect(result).toStrictEqual([createdTodo]);
    });
    it('update todo', async () => {
        const result = await store.dispatch('updateTodo', updatedTodo);
        expect(result).toStrictEqual(updatedTodo);
    });
    it('delete todo', async () => {
        const result = await store.dispatch('deleteTodo', updatedTodo);
        expect(result).toStrictEqual(updatedTodo);
    });
    it('delete completed', async () => {
        const result = await store.dispatch('deleteCompleted');
        expect(result).toStrictEqual([]);
    });
});
