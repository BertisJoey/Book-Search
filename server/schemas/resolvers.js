const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const data = User.findOne({ _id: context.user_id }).select('-__v -password');
                return data;
            }
            throw AuthenticationError;
        },
    },

    Mutation: {
        
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return { token, user };
        },

        loginUser: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError;
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { userId, newBook }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: userId },
                    { $addToSet: {savedBooks: newBook}},
                    { new: true, runValidators: true, }
                )
                return updatedUser;
            }
            throw AuthenticationError;
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user_id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError;
        },
    },
};

module.exports = resolvers;