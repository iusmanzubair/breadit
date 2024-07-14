'use client'

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import axios, { AxiosError } from "axios";
import { subredditSubscribeType } from "@/lib/validators/subreddit";
import {CustomToast } from "@/hooks/use-custom-toast"
import { toast } from "sonner";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
    subredditId: string,
    subredditName: string,
    isSubscribed: boolean
}

export const SubscribeLeaveToggle = ({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) => {
    const { loginToast } = CustomToast();
    const router = useRouter();

    const { mutate: subscribe, isPending: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: subredditSubscribeType = {
                subredditId
            }
            const { data } = await axios.post('/api/subreddit/subscribe', payload);
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) return loginToast()

                if (err.response?.status === 400) {
                    return toast.error(`You have already subscribed to r/${subredditName}!`)
                }
            }

            return toast.error('Could not subscribe!')
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            })
            return toast.success(`You are now subscribed to r/${subredditName}!`);
        }
    })

    const { mutate: unSubscribe, isPending: isUnSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: subredditSubscribeType = {
                subredditId
            }
            const { data } = await axios.post('/api/subreddit/unsubscribe', payload);
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) return loginToast()

                if (err.response?.status === 400) {
                    return toast.error(`You have already Unsubscribed from r/${subredditName}`)
                }
            }

            return toast.error('Could not Unsubscribe!')
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            })
            return toast.success(`You are now Unsubscribed from r/${subredditName}!`);
        }
    })
    return (
        isSubscribed ? (
            <Button isLoading={isUnSubLoading} onClick={()=> unSubscribe()} className="w-full mt-1 mb-4">Leave community</Button>
        ) : (
            <Button isLoading={isSubLoading} onClick={() => subscribe()} className="w-full mt-1 mb-4">Join to post</Button>
        )
    )
}