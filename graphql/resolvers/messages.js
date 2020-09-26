const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
const { Message, User } = require("../../models");

module.exports = {
  Query: {
    async getMessages(_, { from }, { user }) {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const otherUser = await User.findOne({ where: { username: from } });

        if (!otherUser) throw new UserInputError("User not found");

        const usernames = [user.username, otherUser.username];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames }, // from: { [key]: [values]}
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]], // [[key_according_to_which_should_be_ordered]]
        });

        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    async sendMessage(_, { to, content }, { user }) {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const recipient = await User.findOne({ where: { username: to } });

        if (!recipient) throw new UserInputError("User not found");
        else if (recipient.username === user.username)
          throw new UserInputError("You can't message yourself");

        if (!content.trim()) throw new UserInputError("Message is empty");

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
