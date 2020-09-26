const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

module.exports = function (context) {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // we're not throwing error because for the other resolvers that don't need user authentication should work properly
        // throw new AuthenticationError("Unauthenticated");
      }
      context.user = decodedToken;
    });
  }
  return context;
};
