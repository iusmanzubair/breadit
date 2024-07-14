"use client"

import { useState } from "react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/Button"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "@/lib/validators/comment"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { CustomToast } from "@/hooks/use-custom-toast"
import { useRouter } from "next/navigation"

interface CreateCommentProps {
    postId: string,
    replyToId?: string
}

export const CreateComment = ({postId, replyToId}: CreateCommentProps) => {

    const [input, setInput] = useState<string>('')
    const { loginToast } = CustomToast();
    const router = useRouter()

    const {mutate: comment, isPending} = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }

            const { data } = await axios.patch('/api/subreddit/post/comment', payload);
            return data
        },
        onError: (err)=> {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) return loginToast()

                if (err.response?.status === 400) {
                    return toast.error('unable to create comment!')
                }
            }

            return toast.error('Could not Unsubscribe!')
        },
        onSuccess: ()=> {
            router.refresh()
            setInput('')
        }
    })

    return <div className="grid w-full grid-1.5">
        <Label htmlFor="comment">Your Comment</Label>
        <div className="mt-2">
            <Textarea id="comment" value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="what are your thoughts?" />

            <div className="mt-2 flex justify-end">
                <Button isLoading={isPending} disabled={input.length === 0} onClick={()=> comment({postId, text: input, replyToId})}>Post</Button>
            </div>
        </div>
    </div>
}