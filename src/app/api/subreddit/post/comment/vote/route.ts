import { auth } from "@/auth"
import { db } from "@/lib/db"
import { CommentVoteValidator, PostVoteValidator } from "@/lib/validators/vote"
import { z } from "zod"

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const { commentId, voteType } = CommentVoteValidator.parse(body)

        const session = await auth()

        if (!session?.user) return new Response('unauthorized!', { status: 401 })

        const existingVote = await db.commentVote.findFirst({
            where: {
                userId: session?.user?.id,
                commentId
            }
        })

        if (existingVote) {
            if (existingVote.type === voteType) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id as string
                        }
                    }
                })

                return new Response('OK')
            } else {
                await db.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id as string
                        }
                    },
                    data: {
                        type: voteType
                    }
                })
            }

            return new Response('Ok')
        }

        await db.commentVote.create({
            data: {
                type: voteType,
                userId: session.user.id as string,
                commentId
            }
        })

        return new Response('Ok')

    } catch (error) {
        if (error instanceof z.ZodError) return new Response(error.message, { status: 422 }) //unprocessable entity

        return new Response("Could not register your vote, please try again!", { status: 500 })
    }
}