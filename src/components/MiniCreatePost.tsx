'use client'

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation"
import { UserAvatar } from "./UserAvatar";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
    session: Session | null
}

export const MiniCreatePost = ({ session }: MiniCreatePostProps) => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <div className="overflow-hidden rounded-md bg-white shadow">
            <div className="h-full px-6 py-4 flex justify-between gap-6">
                <div className="relative">
                    <UserAvatar user={{
                        name: session?.user?.name,
                        image: session?.user?.image
                    }} />

                    <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
                </div>

                <Input readOnly onClick={() => router.push(pathname + '/submit')} placeholder="Create post" />
                <Button onClick={() => router.push(pathname + '/submit')} variant='ghost'><ImageIcon className="text-zinc-600" /></Button>
                <Button onClick={() => router.push(pathname + '/submit')} variant='ghost'><Link2 className="text-zinc-600" /></Button>
            </div>
        </div>
    )
}