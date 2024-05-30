import { z } from "zod"

export const subredditValidator = z.object({
    name: z.string().min(3).max(21),
})

export const subredditSubscribeValidator = z.object({
    subredditId: z.string()
})

export type subredditPayloadType = z.infer<typeof subredditValidator>
export type subredditSubscribeType = z.infer<typeof subredditSubscribeValidator>