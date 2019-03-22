import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from 'prisma-binding'
import { schemas } from './schemas.js'
import { resolvers } from './resolvers'

// const server = new GraphQLServer({ typeDefs: schemas, resolvers })

const server = new GraphQLServer({
  typeDefs: schemas,
  resolvers,
  context: req => (Object.assign({}, req, {
    db: new Prisma({
      typeDefs: '../database/generated/prisma.graphql', // the generated Prisma DB schema
      endpoint: 'https://eu1.prisma.sh/randika-alditia-73b747/database/dev/_admin', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true // log all GraphQL queries & mutations
    })
  }))
})
export const servicePrisma = () => {
  server.start(() => console.log('Server GraphQL running at port 4000...'))
}
