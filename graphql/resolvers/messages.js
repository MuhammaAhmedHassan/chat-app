const {
  UserInputError,
  AuthenticationError,
  withFilter,
  ForbiddenError,
} = require("apollo-server");
const { Op } = require("sequelize");
const { Message, User, Reaction } = require("../../models");

const events = {
  NEW_MESSAGE: "NEW_MESSAGE",
  NEW_REACTION: "NEW_REACTION",
};

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
    async sendMessage(_, { to, content }, { user, pubsub }) {
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

        // here we're firing an event
        pubsub.publish(events.NEW_MESSAGE, { newMessage: message });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async reactToMessage(_, { uuid, content }, { user, pubsub }) {
      const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
      try {
        // if (!user) throw new AuthenticationError("Unauthenticated");

        // Validate reaction content
        if (!reactions.includes(content))
          throw new UserInputError("Invalid reaction");

        // Get user
        const username = user ? user.username : "";
        user = await User.findOne({ where: { username } });
        if (!user) throw new AuthenticationError("Unauthenticated");

        // Get message
        const message = await Message.findOne({ where: { uuid } });
        if (!message) throw new UserInputError("message not found");

        // If your is allowed to react to this message; either he is the sender or receiver
        if (message.from !== user.username && message.to !== user.username)
          throw new ForbiddenError("Unauthorized");

        // If everything is fine, then create reaction
        // 1- find if user has already reacted to this message
        let reaction = await Reaction.findOne({
          where: { messageId: message.id, userId: user.id },
        });

        if (reaction) {
          // if (reaction) then update it
          reaction.content = content;
          await reaction.save();
        } else {
          // reaction doesn't exist,create it
          reaction = await Reaction.create({
            messageId: message.id,
            userId: user.id,
            content,
          });
        }

        pubsub.publish(events.NEW_REACTION, { newReaction: reaction });

        return reaction;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      // we're sending an array of events
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator([events.NEW_MESSAGE]);
        },
        (parent, _, { user }) => {
          const { newMessage } = parent; // this new message is coming from here: pubsub.publish(events.NEW_MESSAGE, { newMessage: message });

          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
    newReaction: {
      // we're sending an array of events
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator([events.NEW_MESSAGE]);
        },
        async (parent, _, { user }) => {
          const { newReaction } = parent; // this new message is coming from here: pubsub.publish(events.NEW_Reaction, { newMessage: message });
          const message = await newReaction.getMessage(); // sequelize method; getMessage(); based on Model name Message

          if (message.from === user.username || message.to === user.username) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
