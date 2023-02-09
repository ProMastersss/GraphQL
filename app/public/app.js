Vue.use(Vuetify);

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const url = '/graphql';

const fragmentTodoFields = `fragment TodoFields on Todo {
  id done title createdAt updatedAt
}`;

new Vue({
  el: '#app',
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          secondary: '#b0bec5',
        },
      },
    },
  }),
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: '',
      todos: [],
    };
  },
  created() {
    fetch(url, {
      headers,
      method: 'post',
      body: JSON.stringify({
        query: `
        query {
          getTodos {
            id
            done
            title
            createdAt
            updatedAt
          }
        }
      `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.log(res.errors);
        }
        return res;
      })
      .then(({ data }) => {
        this.todos = data.getTodos;
      })
      .catch((e) => console.log(e));
  },
  methods: {
    addTodo() {
      const title = this.todoTitle.trim();
      if (!title) {
        return;
      }
      fetch(url, {
        method: 'post',
        headers,
        body: JSON.stringify({
          query: `
            ${fragmentTodoFields}
            mutation {
              createTodo(todo: { title: "${title}" }) {
                ...TodoFields
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            console.log(res.errors);
          }
          return res;
        })
        .then(({ data }) => {
          this.todos.push(data.createTodo);
          this.todoTitle = '';
        })
        .catch((e) => console.log(e));
    },
    removeTodo(id) {
      fetch(url, {
        method: 'post',
        headers,
        body: JSON.stringify({
          query: `
            mutation {
              removeTodo( id: ${id})
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            console.log(res.errors);
          }
          return res;
        })
        .then(({ data }) => {
          if (data) {
            this.todos = this.todos.filter((t) => t.id !== id);
          }
        })
        .catch((e) => console.log(e));
    },
    completeTodo(id) {
      fetch(url, {
        method: 'post',
        headers,
        body: JSON.stringify({
          query: `
            
            mutation {
              completeTodo(todo: { id: ${id}, done: true }) {
                updatedAt
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            console.log(res.errors);
          }
          return res;
        })
        .then(({ data }) => {
          const idx = this.todos.findIndex((t) => t.id === id);
          this.todos[idx].updatedAt = data.completeTodo.updatedAt;
        })
        .catch((e) => console.log(e));
    },
  },
  filters: {
    capitalize(value) {
      return value.toString().charAt(0).toUpperCase() + value.slice(1);
    },
    date(value, withTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      };

      if (withTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
      }
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value));
    },
  },
});
