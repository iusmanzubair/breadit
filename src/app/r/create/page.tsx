"use client"

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { subredditPayloadType } from "@/lib/validators/subreddit";
import { toast } from "sonner";
import { customToast } from "@/hooks/use-custom-toast";

export default function page() {

    const [input, setInput] = useState<string>('');
    const router = useRouter();
    const { loginToast } = customToast();

    const { mutate: createCommunity, isPending } = useMutation({
        mutationFn: async () => {
            const payload: subredditPayloadType = {
                name: input
            }

            const { data } = await axios.post("/api/subreddit", payload);
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast.error("Subreddit already exists!", {
                        description: "Please choose a different name",
                    })
                }

                if (err.response?.status === 422) {
                    return toast.error("Invalid subreddit name!", {
                        description: "Please choose a name between 3 to 21 characters",
                    })
                }
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            toast.error('Could not create subreddit')
        },
        onSuccess: (data) => {
            router.push(`/r/${data}`)
        }
    })

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Create Community</h1>
                </div>

                <hr className="h-px bg-zinc-500" />

                <div>
                    <p className="text-lg font-medium">Name</p>
                    <p className="text-xs pb-2">
                        Community names including capitalization cannot be changed.
                    </p>

                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">r/</p>
                        <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6" />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant='subtle' onClick={() => router.back()}>Cancel</Button>
                    <Button isLoading={isPending} disabled={input.length === 0} onClick={() => createCommunity()}>Create Community</Button>
                </div>
            </div>
        </div>
    )
}
