import { z } from "zod"

export const subredditValidator = z.object({
    name: z.string().min(3).max(21),
})

export type subredditPayloadType = z.infer<typeof subredditValidator>