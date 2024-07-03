'use client'

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { ExtendedPost } from "@/types/db"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"
import { SinglePost } from "./Post"

interface PostFeedProps {
    initialPosts: ExtendedPost[],
    subreddit?: string
}

export const PostFeed = ({ initialPosts, subreddit }: PostFeedProps) => {
    const { data: session } = useSession()
    const initialPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: initialPostRef.current,
        threshold: 1
    })

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['infinite-query'],
        queryFn: async ({ pageParam = 1 }) => {
            const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` + (!!subreddit ? `&subreddit=${subreddit}` : '')
            const { data } = await axios.get(query)
            return data as ExtendedPost[]
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
        initialPageParam: 1
    })

    useEffect(()=> {
        if(entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage])

    const posts = data.pages.flatMap((page) => page) ?? initialPosts
    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {posts.map((post, index) => {
                const votesAmt = post.votes.reduce((acc, vote) => {
                    if (vote.type === "UP") return acc + 1
                    if (vote.type === "DOWN") return acc - 1
                    return acc
                }, 0)
                const currentVote = post.votes.find((vote) => vote.userId === session?.user?.id)
                if(index === posts.length - 1) {
                    return (
                    <li ref={ref} key={post.id}>
                        <SinglePost currentVote={currentVote} votesAmt={votesAmt} commentAmt={post.comments.length} post={post} subredditName={post.subreddit.name}/>
                    </li>
                    )
                } else {
                    return <SinglePost currentVote={currentVote} votesAmt={votesAmt} commentAmt={post.comments.length} post={post} subredditName={post.subreddit.name}/>
                }
            })}
        </ul>
    )
}