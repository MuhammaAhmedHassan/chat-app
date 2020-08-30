const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    email: String!
  }
  type Query {
    "A simple type for getting started!"
    hello: String
    getUsers: [User]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
  }
`;
