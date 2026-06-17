export const typeDefs = `#graphql
  type Author {
    id: ID! # !: means this field is required
    name: String!
    books: [Book] # This is a relationship field that allows us to fetch the books written by an author. The [Book!]! means that this field will return a list of Book objects, and each Book object in the list is required (non-nullable).
  }

  
  type Book {
    id: ID!
    title: String!
    publishedYear: Int # without ! means this field is optional
    author: Author # This is a relationship field that allows us to fetch the author of a book. The Author! means that this field will return an Author object, and the Author object is required (non-nullable).
  }

  type Query { # All the methods that are used to get the data and we want to expose to the client will be defined inside the Query type.
    authors: [Author!]!
    books: [Book]
    language: String!
  }

   type Mutation { # All the methods that are used to update (like creating, updating, or deleting records) the data and we want to expose to the client will be defined inside Mutation type.
    # addAuthor(name: String!): Author!
     addBook(title: String!, publishedYear: Int, authorId: ID!): Book!
   }
`;

// #graphql way of writing comment in graphql schema