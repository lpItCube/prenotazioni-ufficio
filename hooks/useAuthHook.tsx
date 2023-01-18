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
    const username = session?.data?.user?.name

    useEffect(() => {
        const loadUserRole = async () => {
            setRoleLoading(true)
            try {
                const user = await axios.get(`/api/users/${username}`)
                const role = user.data.role
                console.log('USER DATA',user)
                setUserRole(role)
                dispatch(setRole(role))
            } catch (err:any) {
                setErrorRole(err)
            }
            setRoleLoading(false)
        }

        loadUserRole()
    }, [username])


    return {
        roleLoading,
        userRole,
        errorRole
    }
}