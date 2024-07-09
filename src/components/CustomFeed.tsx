import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { PostFeed } from "./PostFeed"
import { auth } from "@/auth"


export const CustomFeed = async ()=> {
    
    const session = await auth();

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user?.id
        },
        include: {
            subreddit: true
        }
    })

    const posts = await db.post.findMany({
        where: {
            subreddit: {
                name: {
                    in: followedCommunities.map(({subreddit})=> subreddit.id)
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            votes: true,
            comments: true,
            author: true,
            subreddit: true
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS
    })
 
    return <PostFeed initialPosts={posts}/>
}