# GraphQL Learning Project

Welcome to your GraphQL learning project! This server is designed to demonstrate the core concepts of GraphQL in a clear and understandable way. The code is heavily commented to explain what's happening at each step.

## Features

This project covers the following GraphQL concepts:

-   **Basic Schema Definition:** `Query`, `String`, `Int`, `ID!`, etc.
-   **Resolvers:** The functions that fetch your data.
-   **Mutations:** How to modify data (create, update, delete).
-   **Input Types:** A cleaner way to pass arguments to mutations.
-   **Relationships:** How to create connections between types (e.g., a Book has an Author).
-   **Error Handling:** How to return meaningful errors from your API.
-   **Subscriptions:** Real-time updates over WebSockets.

## Getting Started

### 1. Install Dependencies

First, you'll need to install the Node.js dependencies. Open your terminal in the project root and run:

```bash
npm install
```

### 2. Start the Server

Once the dependencies are installed, you can start the server:

```bash
npm start
```

You should see the following output in your terminal:

```
Server ready at http://localhost:4000/graphql
Subscriptions ready at ws://localhost:4000/graphql
```

### 3. Open the GraphQL Playground

Open your web browser and navigate to http://localhost:4000/graphql. This will open the Apollo Studio Sandbox, an in-browser IDE that you can use to interact with your GraphQL API.

## Example Operations

Here are some example queries, mutations, and subscriptions you can run in the Apollo Sandbox to explore the API.

---

### Query: Fetching Data

**1. Get all books with their titles and IDs**

```graphql
query GetAllBooks {
  books {
    id
    title
  }
}
```

**2. Get a single book by its ID, including its author's details**

This demonstrates the power of GraphQL's nested queries.

```graphql
query GetSingleBook {
  book(id: "1") {
    id
    title
    publishedYear
    author {
      id
      name
    }
  }
}
```

**3. Get an author and all the books they have written**

```graphql
query GetAuthorAndBooks {
  author(id: "2") {
    name
    bio
    books {
      id
      title
    }
  }
}
```

**4. Example of an error**

Try querying for a book with an ID that doesn't exist.

```graphql
query GetNonExistentBook {
  book(id: "999") {
    id
    title
  }
}
```

You'll receive a proper GraphQL error in the response, thanks to our error handling.

---

### Mutation: Modifying Data

**1. Add a new book**

This mutation will create a new book and add it to our in-memory database.

```graphql
mutation AddNewBook {
  addBook(input: {
    title: "The Lord of the Rings",
    publishedYear: 1954,
    authorId: "1"
  }) {
    id
    title
    publishedYear
    author {
      name
    }
  }
}
```

---

### Subscription: Real-Time Updates

**1. Subscribe to new books**

To test subscriptions, you need two browser tabs open to the Apollo Sandbox.

*   **In the first tab:** Run the following subscription. The "play" button will turn into a "stop" button, and it will show a "Listening..." state.

    ```graphql
    subscription OnBookAdded {
      bookAdded {
        id
        title
      }
    }
    ```

*   **In the second tab:** Run the `AddNewBook` mutation from the section above.

As soon as the mutation completes, you will see the data for the new book appear in real-time in the first tab!
