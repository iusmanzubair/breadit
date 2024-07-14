import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const CustomToast = () => {
    const router = useRouter();
    const loginToast = () => {
        toast.error('Login required!', {
            action: {
                label: 'Login',
                onClick: ()=> router.push('/sign-in')
            },
        })
    }
    return { loginToast }
}