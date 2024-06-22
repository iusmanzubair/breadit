import { Comment, Post, Subreddit, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
    subreddit: Subreddit,
    votes: Vote[],
    comments: Comment[],
    author: User
}