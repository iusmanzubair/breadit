import { z } from "zod";

export const postValidator = z.object({
    title: z.string().min(3, {message: 'Title should be 3 characters long!'}).max(128, {message: 'Title should not be longer than 128 characters!'}),
    subredditId: z.string(),
    content: z.any()
})

export type postSubmissionType = z.infer<typeof postValidator>