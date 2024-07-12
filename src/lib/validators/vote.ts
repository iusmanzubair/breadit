import {z} from "zod"

export const PostVoteValidator = z.object({
    postID: z.string(),
    voteType: z.enum(['UP', 'DOWN'])
})

export type PostVoteRequest = z.infer<typeof PostVoteValidator>

export const CommentVoteValidator = z.object({
    commentId: z.string(),
    voteType: z.enum(['UP', 'DOWN'])
})

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>