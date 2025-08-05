// This file contains the resolver functions for our GraphQL schema.
// Resolvers are responsible for fetching the data for the fields in the schema.
// Each field in the schema has a corresponding resolver function.

// We import our in-memory database.
import db from './db.js';
import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

// A PubSub (Publish/Subscribe) instance is used to handle real-time data for subscriptions.
// When a mutation happens, it "publishes" an event. A subscription then listens for that
// specific event and pushes data to the client.
const pubsub = new PubSub();
const BOOK_ADDED_TOPIC = 'BOOK_ADDED';

// The resolvers object mirrors the structure of the schema.
export const resolvers = {
  // Resolvers for the "Query" type.
  Query: {
    // Resolver for the "books" query.
    // This function is called when a client sends the "books" query.
    // It returns the entire array of books from our database.
    books: () => db.books,

    // Resolver for the "book" query.
    book: (parent, args) => {
      const book = db.books.find(book => book.id === args.id);

      // If the book is not found, we throw a specific error.
      // Apollo Server catches this and sends a formatted error response to the client.
      if (!book) {
        throw new GraphQLError('Book not found.', {
          // The `extensions` object is where you can provide additional,
          // machine-readable information about the error. A common practice
          // is to include an error code.
          extensions: {
            code: 'NOT_FOUND',
            argumentName: 'id',
          },
        });
      }

      return book;
    },

    // Resolver for the "authors" query.
    authors: () => db.authors,

    // Resolver for the "author" query.
    author: (parent, args) => {
      const author = db.authors.find(author => author.id === args.id);

      if (!author) {
        throw new GraphQLError('Author not found.', {
          extensions: {
            code: 'NOT_FOUND',
            argumentName: 'id',
          },
        });
      }

      return author;
    },
  },

  // Resolvers for the "Mutation" type.
  Mutation: {
    // Resolver for the "addBook" mutation.
    addBook: (parent, { input }) => {
      const newBook = {
        id: String(Math.floor(Math.random() * 10000)),
        ...input,
      };

      db.books.push(newBook);

      // After adding the book, we publish an event to the 'BOOK_ADDED' topic.
      // The payload is an object with a key that matches the subscription field name.
      pubsub.publish(BOOK_ADDED_TOPIC, { bookAdded: newBook });

      return newBook;
    },
  },

  // Resolver for the "Subscription" type.
  Subscription: {
    // This resolver is special. It doesn't return data directly.
    // Instead, it returns an AsyncIterator, which is used by the GraphQL
    // server to push events to the client.
    bookAdded: {
      // The `subscribe` function is called when a client initiates a subscription.
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED_TOPIC]),
    },
  },

  // Resolvers for the fields within the "Book" type.
  Book: {
    author: (parent) => {
      return db.authors.find(author => author.id === parent.authorId);
    },
  },

  // Resolvers for the fields within the "Author" type.
  Author: {
    books: (parent) => {
      return db.books.filter(book => book.authorId === parent.id);
    },
  },
};
