import { auth } from "@/auth"
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment"
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const {postId, text, replyToId} = CommentValidator.parse(body)

        const session = await auth();

        if(!session?.user) return new Response('unauthorized', {status: 401})
            
        await db.comment.create({
            data: {
                postId,
                text,
                replyToId,
                authorId: session.user.id as string
            }
        })

        return new Response('Ok')
    } catch (error) {
        if (error instanceof z.ZodError) return new Response('Invalid request data passed', { status: 422 })

        return new Response('Could not create comment', { status: 500 })
    }
}