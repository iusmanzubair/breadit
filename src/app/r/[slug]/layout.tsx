import { auth } from "@/auth"
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns"
import { SubscribeLeaveToggle } from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default async function layout({ children, params: { slug } }: { children: React.ReactNode, params: { slug: string } }) {
    const session = await auth();

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true
                }
            }
        }
    })

    if (!subreddit) return notFound();

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
        where: {
            subreddit: {
                name: slug
            },
            user: {
                id: session.user.id
            }
        }
    })

    const isSubscribed = !!subscription;

    const members = await db.subscription.count({
        where: {
            subreddit: {
                name: slug
            }
        }
    })

    return (
        <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">{children}</div>

                    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200">
                        <div className="px-6 py-4">
                            <p className="font-semibold py-3">About r/{subreddit.name}</p>
                        </div>

                        <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-gray-700">
                                    <time>
                                        {format(subreddit.createdAt, 'MMMM d, yyyy')}
                                    </time>
                                </dd>
                            </div>

                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Members</dt>
                                <dd className="text-gray-700">
                                    <div>{members}</div>
                                </dd>
                            </div>

                            {subreddit.creatorId === session?.user?.id ? (
                                <div className="flex justify-between gap-x-4 py-3">
                                    <p className="text-gray-500">You created this community</p>
                                </div>
                            ) : null}

                            {subreddit.creatorId !== session?.user?.id ? (
                                <SubscribeLeaveToggle subredditId={subreddit.id} subredditName={subreddit.name} isSubscribed={isSubscribed}/>
                            ) : null}

                            <Link href={`/r/${slug}/submit`} className={buttonVariants({variant: 'outline', className: 'w-full mb-6'})}>Create post</Link>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}
