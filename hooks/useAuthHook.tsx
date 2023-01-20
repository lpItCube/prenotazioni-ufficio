import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"

// Redux
import { useDispatch } from 'react-redux'
import { setUser } from '../features/authSlice'

export const useAuthHook = () => {

    const session = useSession()
    const dispatch = useDispatch()

    const [roleLoading, setRoleLoading] = useState<Boolean>(false)
    const [userRole, setUserRole] = useState<String>('')
    const [errorRole, setErrorRole] = useState<String>()
    const sessionUsername = session?.data?.user?.name

    useEffect(() => {
        const loadUserRole = async () => {
            setRoleLoading(true)
            try {
                const user = await axios.get(`/api/users/${sessionUsername}`)
                const role = user.data.role
                const username = user.data.username
                const userId = user.data.id

                console.log('USER DATA',user)
                setUserRole(role)
                dispatch(setUser({role, username, userId}))
            } catch (err:any) {
                setErrorRole(err)
            }
            setRoleLoading(false)
        }

        loadUserRole()
    }, [sessionUsername])


    return {
        roleLoading,
        userRole,
        errorRole
    }
}