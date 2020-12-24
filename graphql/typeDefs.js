const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    email: String
    createdAt: String!
    token: String
    imageUrl: String
    latestMessage: Message
  }

  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }

  type Reaction {
    uuid: String!
    content: String!
    createdAt: String!
    Message: Message!
    User: User!
  }

  type Query {
    "A simple type for getting started!"
    hello: String
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(uuid: String!, content: String): Reaction! # uuid: of_message, content: type_of_reaction_in_string_form
  }

  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;
