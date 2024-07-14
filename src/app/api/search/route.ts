import { db } from "@/lib/db"
import { z } from "zod"

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const q = url.searchParams.get('q')

        if(!q) return new Response("Invalid Request!", {status: 400})

        const results = await db.subreddit.findMany({
            where: {
                name: {
                    startsWith: q
                }
            },
            include: {
                _count: true
            },
            take: 5
        })

        return new Response(JSON.stringify(results))
    } catch (error) {
        if (error instanceof z.ZodError) return new Response(error.message, { status: 422 }) //unprocessable entity

        return new Response("Could not process request", { status: 500 })
    }
}