const typeDefs =`
    type User {
        _id: ID!
        username: String
        email: String
        password: String
        bookCount: Int
        savedBooks: [Book] 
    }
    type Book {
        _id: ID!
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
    input BookInput {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
    type Query {
        me: User
    }
    type Auth {
        token: ID!
        user: User
    }
    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        loginUser(email: String!, password: String!): Auth

        saveBook(newBook: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;