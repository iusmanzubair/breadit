import { auth } from "@/auth";
import { db } from "@/lib/db";
import { subredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user) return new Response("Unauthorized", { status: 401 }) // unauthorized

        const body = await req.json();

        const { name } = subredditValidator.parse(body)

        const subredditExists = await db.subreddit.findFirst({
            where: { name }
        })

        if (subredditExists) return new Response("Subreddit already exist!", { status: 409 }) // conflict

        const subreddit = await db.subreddit.create({
            data: {
                name,
                creatorId: session.user.id
            }
        })

        await db.subscription.create({
            data: {
                userId: session.user.id as string,
                subredditId: subreddit.id
            }
        })

        return new Response(subreddit.name)

    } catch (error) {
        if (error instanceof z.ZodError) return new Response(error.message, { status: 422 }) //unprocessable entity

        return new Response("Could not create community!", { status: 500 })
    }
}