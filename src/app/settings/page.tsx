import { auth } from "@/auth"
import { UserNameForm } from "@/components/UserNameForm";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await auth();
    if(!session?.user) redirect('/sign-in')
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>

      <div className="grid gap-10">
        <UserNameForm user={{
            id: session.user.id!,
            username: session.user.name || ''
        }} />
      </div>
    </div>
  )
}
