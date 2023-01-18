import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"

// Redux
import { useDispatch } from 'react-redux'
import { setRole } from '../features/authSlice'

export const useAuthHook = () => {

    const session = useSession()
    const dispatch = useDispatch()

    const [roleLoading, setRoleLoading] = useState<Boolean>(false)
    const [userRole, setUserRole] = useState<String>('')
    const [errorRole, setErrorRole] = useState<String>()

    useEffect(() => {
        const loadUserRole = async () => {
            const username = session?.data?.user?.name
            setRoleLoading(true)
            try {
                const user = await axios.get(`/api/users/${username}`)
                const role = user.data.role
                setUserRole(role)
                dispatch(setRole(role))
            } catch (err:any) {
                setErrorRole(err)
            }
            setRoleLoading(false)
        }

        loadUserRole()
    }, [])


    return {
        roleLoading,
        userRole,
        errorRole
    }
}