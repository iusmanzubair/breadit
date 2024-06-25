"use client"

import { VoteType } from "@prisma/client"
import { useState } from "react"

interface PostVotesClient {
    postID: string,
    initialPostAmt: number,
    initialVote?: VoteType | null
}

export const PostVotesClient = ({postID, initialPostAmt, initialVote}: PostVotesClient)=> {
    const [votesAmt, setVotesAmt] = useState<number>(initialPostAmt)
    return <div></div>
}