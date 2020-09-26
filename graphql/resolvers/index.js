const userResolvers = require("./users");
const messageResolvers = require("./messages");

module.exports = {
  Message: {
    // this is a field in typeDefs, that's why
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    // this is a field in typeDefs, that's why
    // createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
};
