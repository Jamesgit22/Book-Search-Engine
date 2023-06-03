const User = require('../models/User');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        return null;
      }
      const user = await User.findOne({ _id: context.user._id });
      return user;
    },
  },
  Mutation: {
    async addUser(parent, args) {
      const user = await User.create(args);
      console.log(user);
      const token = signToken(user);
      console.log(token);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No profile with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    async removeBook(parent, { bookId }, context) {
      console.log("BACKEND##################");
      try {
      if (!context.user) {
        throw new Error('You need to be logged in to perform this action.');
      }
      console.log(bookId);
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return null;
      }
      return updatedUser;
    } catch (err) {
      console.message(err);
    }
    },
    async saveBook(parent, { bookData }, context) {
      if (!context.user) {
        throw new Error('You need to be logged in to perform this action.');
      }
      if (!bookData || Object.keys(bookData).length === 0) {
        throw new Error('Invalid book data.');
      }
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error('Failed to save the book.');
      }
    },
  },
};


module.exports = resolvers;
