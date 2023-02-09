const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    name: String!
    age: Int!
  }

  type TestType {
    info: String!
    users: [User!]!
  }
  
  input UserInput {
    name: String!
  }

  input TodoInput {
    title: String!
  }

  input TodoInputDone {
    id: ID!
    done: Boolean!
  }

  scalar Date

  type Todo {
    id: ID!
    done: Boolean!
    title: String!
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    test: TestType!
    random(min: Int!, max: Int!, count: Int!): [Float!]!
    getTodos: [Todo!]!
  }

  type Mutation {
    addTestUser(user: UserInput!): User!
    createTodo(todo: TodoInput!): Todo!
    completeTodo(todo: TodoInputDone!): Todo!
    removeTodo(id: ID!): Boolean!
  }
`);
