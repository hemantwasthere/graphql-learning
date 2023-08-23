import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import createApolloGraphqlServer from './graphql';

async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) || 8000

    app.use(express.json())

    app.get('/', (req, res) => {
        res.json({ message: "Serve is up and running!" })
    })

    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer()))

    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`)
    })
}

init()