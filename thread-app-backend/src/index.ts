import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { prismaClient } from './lib/db';

async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) || 8000

    // Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                firstName: String!
                lastName: String!
                email: String!
                profileImageURL: String
                password: String!
                salt: String
            }

            type Query {
                getUsers: [User!]!
            }

            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                getUsers: async () => {
                    const users = await prismaClient.user.findMany()
                    return users
                }
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }:
                    { firstName: string, lastName: string, email: string, password: string }
                ) => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: 'random_salt'
                        }
                    })
                    return true
                }
            }
        }
    })

    app.use(express.json())

    // start the graphql server
    await gqlServer.start()

    app.use('/graphql', expressMiddleware(gqlServer))

    app.get('/', (req, res) => {
        res.json({ message: "Serve is up and running!" })
    })

    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`)
    })
}

init()