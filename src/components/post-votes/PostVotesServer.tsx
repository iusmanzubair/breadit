import { auth } from "@/auth"
import { Post, Vote, VoteType } from "@prisma/client"
import { notFound } from "next/navigation";
import { PostVotesClient } from "./PostVotesClient";

interface PostVotesServerProps {
    postId: string,
    initialVotesAmt?: number,
    initialVote?: VoteType | null,
    getData: ()=> Promise<Post & {votes: Vote[]} | null>
}

export const PostVotesServer = async ({postId, initialVote, initialVotesAmt, getData}: PostVotesServerProps) => {
    const session = await auth();
    
    let _votesAmt: number = 0;
    let _currentVote: VoteType | null | undefined = undefined
    
    if(getData) {
        const post = await getData();
        if(!post) return notFound()

        _votesAmt = post.votes.reduce((acc, vote)=> {
            if(vote.type === 'UP') return acc + 1
            if(vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)

        _currentVote = post.votes.find((vote)=> vote.userId === session?.user?.id)?.type
    } else {
        _votesAmt = initialVotesAmt!
        _currentVote = initialVote
    }
    return <PostVotesClient postID={postId} initialVotesAmt={_votesAmt} initialVote={_currentVote}/>
}