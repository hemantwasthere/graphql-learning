import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import bodyParser = require('body-parser');

async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) || 8000

    // Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String!
                say(name: String!): String!
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello World!',
                say: (parent, { name }: { name: string }) => `Hey ${name}, How are you?`
            }
        }
    })

    app.use(express.json())
    // app.use(bodyParser.json())

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