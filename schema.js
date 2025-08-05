const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} = require('graphql');
const User = require('./models/User');

// User Type
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    fullname: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find(); // fetch from MongoDB
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
