import { EditorOutput } from "@/components/EditorOutput"
import { PostVotesServer } from "@/components/post-votes/PostVotesServer"
import { buttonVariants } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { formatTimeToNow } from "@/lib/utils"
import { redis } from "@/lib/validators/redis"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface PageProps {
    params: {
        postid: string
    }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function page({params}: PageProps) {

    const cachedPost = (await redis.hgetall(`post:${params.postid}`)) as CachedPost

    let post: (Post & {votes: Vote[]; author: User}) | null = null

    if(!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: params.postid
            },
            include: {
                author: true,
                votes: true
            }
        })
    }

    if(!post && !cachedPost) return notFound();
  return <div>
        <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
            <Suspense fallback={<PostVoteShell />}>
                <PostVotesServer postId={post?.id ?? cachedPost.id} getData={async()=> {
                    return await db.post.findUnique({
                        where: {
                            id: params.postid
                        },
                        include: {
                            votes: true
                        }
                    })
                }}/>
            </Suspense>

            <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
                <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
                    Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
                    {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                </p>
                <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
                    {post?.title ?? cachedPost.title}
                </h1>

                <EditorOutput content={post?.content ?? cachedPost.content}/>
            </div>
        </div>
    </div>
}

function PostVoteShell() {
    return <div className="flex items-center flex-col pr-6 w-20">
        <div className={buttonVariants({variant: 'ghost'})}>
            <ArrowBigUp className="h-5 w-5 text-zinc-700"/>
        </div>

        <div className="text-center py-2 font-medium text-sm text-zinc-900">
            <Loader2 className="h-3 w-3 animate-spin"/>
        </div>
        <div className={buttonVariants({variant: 'ghost'})}>
            <ArrowBigDown className="h-5 w-5 text-zinc-700"/>
        </div>
    </div>
}