const Todo = require('../models/todo');

const users = [
  {
    name: 'Вася',
    age: 21,
  },
  {
    name: 'Петя',
    age: 18,
  },
];

module.exports = {
  test() {
    return {
      info: 'List users',
      users: users,
    };
  },
  random({ min, max, count }) {
    return new Array(count)
      .fill(null)
      .map(() => Math.random() * (max - min) + min);
  },
  addTestUser({ user: { name } }) {
    const user = {
      name,
      age: Math.trunc(this.random({ min: 10, max: 30, count: 1 }).at(0)),
    };
    users.push(user);

    return user;
  },
  async getTodos() {
    try {
      return await Todo.findAll();
    } catch (error) {
      throw new Error('Не удалось получить список задач');
    }
  },
  async createTodo({ todo: { title } }) {
    try {
      return await Todo.create({
        title,
        done: false,
      });
    } catch (error) {
      throw new Error('Не удалось cоздать задачу');
    }
  },
  async completeTodo({ todo: { id, done } }) {
    try {
      const todoModel = await Todo.findByPk(+id);
      todoModel.done = done;
      await todoModel.save();

      return todoModel;
    } catch (error) {
      throw new Error('Не удалось обновить состояние задачи');
    }
  },
  async removeTodo({ id }) {
    try {
      const todos = await Todo.findAll({
        where: {
          id: +id,
        },
      });
      const todo = todos[0];
      await todo.destroy();

      return true;
    } catch (error) {
      throw new Error('Не удалось удалить задачу');
    }
  },
};
