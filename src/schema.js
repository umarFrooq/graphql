// This file defines our GraphQL schema. The schema is a contract that specifies
// the capabilities of the API. It defines the types of data that can be queried
// and the relationships between them.

// We use the GraphQL Schema Definition Language (SDL) to write our schema.
// The `gql` tag is used to parse the schema string into a format that
// Apollo Server can understand.

// The `typeDefs` constant holds our schema definition.
export const typeDefs = `#graphql
  # This is a GraphQL comment. Comments in GraphQL start with a #.

  # We define a "Book" type. A type is a custom object that represents a
  # piece of data in our application. Each type has a set of fields.
  type Book {
    id: ID! # The "ID" scalar type represents a unique identifier. The "!" means this field is non-nullable.
    title: String!
    publishedYear: Int
    authorId: ID!
    # This field represents the relationship between a Book and an Author.
    # When a client queries for a book, they can also ask for the author's details.
    author: Author
  }

  # We define an "Author" type.
  type Author {
    id: ID!
    name: String!
    bio: String
    # This field represents the relationship between an Author and their Books.
    books: [Book!]
  }

  # The "Query" type is special. It lists all the available queries that
  # clients can execute to fetch data. Think of it as the entry point for
  # all read operations.
  type Query {
    # This query returns an array of all books.
    # The square brackets around "Book" mean it returns a list of books.
    # The "!" after [Book] means the list itself cannot be null, but it can be empty.
    books: [Book!]

    # This query returns a single book by its ID.
    # It takes an "id" argument of type ID.
    book(id: ID!): Book

    # This query returns an array of all authors.
    authors: [Author!]

    # This query returns a single author by their ID.
    author(id: ID!): Author
  }

  # The "Mutation" type is the entry point for all write operations.
  # Just like the Query type, it defines the available operations, but these
  # operations are expected to have side effects (i.e., they change data).
  type Mutation {
    # This mutation adds a new book to our collection.
    # It takes a single argument, "input", which is of the "AddBookInput" type.
    # It returns the newly created book.
    addBook(input: AddBookInput!): Book
  }

  # Input types are special object types that can be used as arguments for
  # queries and mutations. They are a good way to encapsulate complex objects
  # that you expect to be provided as input.
  input AddBookInput {
    title: String!
    publishedYear: Int
    authorId: ID!
  }

  # The "Subscription" type defines real-time operations. Clients can
  # subscribe to these events and receive data as it's published.
  type Subscription {
    # This subscription fires every time a new book is added.
    # It returns the book that was just added.
    bookAdded: Book
  }
`;
