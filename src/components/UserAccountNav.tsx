import { User } from "next-auth"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { UserAvatar } from "./UserAvatar"

interface UserAccountNavProps {
    user: Pick<User, 'name' | 'email' | 'image'>
}

export const UserAccountNav = ({user}: UserAccountNavProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar className="h-8 w-8" user={{
                    name: user.name || null,
                    image: user.image || null
                }}/>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}