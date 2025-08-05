// In-memory data store

// This file acts as a simple in-memory database. We're using arrays of objects
// to store our data. In a real-world application, this data would come from a
// database like PostgreSQL, MongoDB, or a REST API.

let books = [
  {
    id: '1',
    title: 'The Awakening',
    authorId: '1',
    publishedYear: 1899,
  },
  {
    id: '2',
    title: 'City of Glass',
    authorId: '2',
    publishedYear: 1985,
  },
];

let authors = [
    {
        id: '1',
        name: 'Kate Chopin',
        bio: 'Kate Chopin (born Katherine O\'Flaherty; February 8, 1850 – August 22, 1904) was an American author of short stories and novels based in Louisiana.'
    },
    {
        id: '2',
        name: 'Paul Auster',
        bio: 'Paul Benjamin Auster (February 3, 1947 – April 30, 2024) was an American writer and film director.'
    }
]


export default { books, authors };
