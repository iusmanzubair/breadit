import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if(!session?.user) return new Response("Unauthorized", {status: 401})

        const body = await req.json()

        const {name} = UsernameValidator.parse(body)

        const username = await db.user.findFirst({
            where: {
                username: name
            }
        })

        if(username) return new Response("Username is taken", {status: 409})

        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                username: name
            }
        })

        return new Response("Ok")
    } catch (error) {
        if (error instanceof z.ZodError) return new Response(error.message, { status: 422 }) //unprocessable entity

        return new Response("Could not update username", { status: 500 })
    }
}