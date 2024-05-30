import { auth } from "@/auth";
import { db } from "@/lib/db";
import { subredditSubscribeValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) return new Response('Unauthorized', { status: 401 })

        const body = await req.json();
        const { subredditId } = subredditSubscribeValidator.parse(body);

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id
            }
        })

        if (!subscriptionExists) return new Response('You are not subscribed to this subreddit!', { status: 400 }) // bad request

        const subreddit = await db.subreddit.findFirst({
            where: {
                id: subredditId,
                creatorId: session.user.id
            }
        })

        if(subreddit) return new Response('You cant unsubscribe from your own subreddit', {status: 400})

        await db.subscription.delete({
            where: {
                userId_subredditId: {
                    subredditId,
                    userId: session.user.id as string
                }
            }
        })

        return new Response(subredditId)

    } catch (error) {
        if (error instanceof z.ZodError) return new Response(error.message, { status: 422 }) //unprocessable entity

        return new Response("Could not unsubscribe, please try again later!", { status: 500 })
    }
}
