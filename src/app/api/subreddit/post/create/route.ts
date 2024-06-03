import { auth } from "@/auth"
import { db } from "@/lib/db"
import { postValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user) return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { title, subredditId, content } = postValidator.parse(body)

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id
            }
        })

        if (!subscriptionExists) return new Response('Subscribe to post!', { status: 400 })

        await db.post.create({
            data: {
                title,
                content,
                authorId: session.user.id as string,
                subredditId
            }
        })

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) return new Response('Invalid POST request data passed', { status: 422 })

        return new Response('Could not post to subreddit at this moment', { status: 500 })
    }
}
