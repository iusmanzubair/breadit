import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { ExtendedPost } from "@/types/db"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRef } from "react"

interface PostFeedProps {
    initialPosts: ExtendedPost[],
    subreddit?: string
}

export const PostFeed = ({ initialPosts, subreddit }: PostFeedProps) => {
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
    return (
        <div></div>
    )
}