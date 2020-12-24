const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

module.exports = function (context) {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // we're not throwing error because for the other resolvers that don't need user authentication should work properly
        // throw new AuthenticationError("Unauthenticated");
      }
      context.user = decodedToken;
    });
  }

  context.pubsub = pubsub;
  return context;
};
