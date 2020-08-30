const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { JWT_SECRET } = require("../config/env.json");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    hello: () => "world",
    getUsers: async (_, __, context) => {
      let user;

      try {
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split("Bearer ")[1];
          jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("Unauthenticated");
            }
            user = decodedToken;

            console.log(user);
          });
        }

        const users = await User.findAll({
          where: {
            username: {
              [Op.ne]: user.username,
            },
          },
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async login(_, { username, password }) {
      const { valid, errors } = loginValidate({ username, password });

      try {
        if (!valid) {
          throw new UserInputError("Bad input", { errors });
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          errors.password = "Incorrect password";
          throw new UserInputError("Password is incorrect", { errors });
        }

        const token = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: 60 * 60,
        });

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    async register(_, { username, email, password, confirmPassword }) {
      // validate data
      const { valid, errors } = registerValidate({
        username,
        email,
        password,
        confirmPassword,
      });
      try {
        if (!valid) {
          throw errors;
        }

        // Check if user exists in our database
        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUsername) errors.username = "Username is taken";
        // if (userByEmail) errors.email = "E-mail is taken";

        if (Object.keys(errors).length) {
          throw errors;
        }

        // TODO: hash password
        password = await bcrypt.hash(password, 12);

        // TODO: create user
        const user = await User.create({
          username,
          email,
          password,
        });

        // when you return it like this it returns the JSON version
        // otherwise you can do user.toJSON();
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        if (err.name === "SequelizeUniqueConstraintError") {
          // err.errors.forEach((e) => (errors[e.path] = e.message));
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};

const loginValidate = ({ username, password }) => {
  const errors = {};

  if (!username.trim()) errors.username = "Username must not be empty";
  if (!password.trim()) errors.password = "Password must not be empty";

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

const registerValidate = ({ username, email, password, confirmPassword }) => {
  const errors = {};

  if (!username.trim()) errors.username = "Username must not be empty";
  if (!email.trim()) errors.email = "E-mail must not be empty";
  if (!password.trim())
    errors.password = "Password must not be 4 characters long";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Confirm Password must match to password";

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};
