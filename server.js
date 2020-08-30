const { ApolloServer, gql } = require("apollo-server");

const { sequelize } = require("./models");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  sequelize
    .authenticate()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(err));
});
