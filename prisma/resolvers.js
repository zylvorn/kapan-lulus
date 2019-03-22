export const resolvers = {
  Query: {
    posts (parent, args, ctx, info) {
      return ctx.db.query.posts({ }, info)
    },
    post (parent, args, ctx, info) {
      return ctx.db.query.post({ where: { id: args.id } }, info)
    }
  },
  Mutation: {
    createDraft (parent, { title, content }, ctx, info) {
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            content
          }
        },
        info
      )
    },
    deletePost (parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({ where: { id } }, info)
    },
    publish (parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { published: true }
        },
        info
      )
    }
  }
}
