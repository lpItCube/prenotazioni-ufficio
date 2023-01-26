import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import axios from 'axios'

// Redux
import { useSelector, useDispatch } from "react-redux"
// import { getUserRole } from "../../features/authSlice"
import { setPendingNotification } from '../../features/notificationSlice'

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

// Utils
import { getStringDate, getStringHours } from '../../utils/datePharser'

// Components 
import { Table, TableHeader, TableBody, TableRow, TableCol } from '../../components/Ui/Table'
import Button from '../../components/Ui/Button'
import { RiDeleteBin3Line } from "react-icons/ri"
import { TbClipboardCheck } from "react-icons/tb";
import Spinner from '../../components/Ui/Spinner'

function pending({
    setHitNotification
  }:any) {

    const { userData } = useAuthHook() 

    const userRole = userData.role
    const router = useRouter();
    const session = useSession()
    const dispatch = useDispatch()
    const [isAuthorized, setIsAutorized] = useState(false)
    const [reserves, setReserves] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    console.log('SESSION', session)

    useEffect(() => {
        if (!session?.data?.user?.role) return
        if (session?.data?.user?.role === 'ADMIN') {
            setIsAutorized(true)
            return
        }
        router.push("/prenotazioni");
    }, [session]);


    useEffect(() => {
        setIsLoading(true)
        const getReserves = async () => {
            const response = await axios.get(`/api/reserve/pending`)
            const reorderData = response.data.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? -1 : 1)
            setReserves(reorderData)
            setIsLoading(false)
        }
        if (session.status === "authenticated")
            getReserves()
    }, [session])
    
    useEffect(() => {
        console.log('UPDATE NOW')
        dispatch(setPendingNotification({pending:reserves.length}))
        setHitNotification(true)
    }, [reserves, session])
    
    
    if (!isAuthorized) {
        console.log('UNHOUTORIZED',userRole)
        return
    }

    const handleApprovation = async (status: any, id: any) => {
        if (status === 'approved') {
            await axios.patch("/api/reserve/approveReserve", {
                id,
            })
            const response = await axios.get(`/api/reserve/pending`)
            const reorderData = response.data.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? -1 : 1)
            setReserves(reorderData)

        } else {
            const deleteSeat = await axios.delete("/api/reserve/" + id);
            const response = await axios.get(`/api/reserve/pending`)
            const reorderData = response.data.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? -1 : 1)
            setReserves(reorderData)
        }
        dispatch(setPendingNotification({pending:reserves.length-1}))
        setHitNotification(true)

    }

    let tableContent: any

    if (reserves.length > 0) {
        tableContent = (
            <>
                {reserves.map((r: any, index: number) => {
                    return (
                        <TableRow
                            key={index}
                            className={r.status === 'accepted' ? ' reserve--accepted' : ' reserve--pending'}
                        >
                            <TableCol
                                className=''
                            >
                                <p>{getStringDate(r.from).day} {getStringDate(r.from).month} {getStringDate(r.from).year}</p>
                            </TableCol>
                            <TableCol
                                className=""
                            >
                                <p>{getStringHours(r.from).hours} - {getStringHours(r.to).hours}</p>
                            </TableCol>
                            <TableCol
                                className=""
                            >
                                {r.seat.name}
                            </TableCol>
                            <TableCol
                                className=""
                            >
                                {r.user.username}
                            </TableCol>
                            <TableCol
                                className=""
                            >
                                {r.status === 'accepted' ? 'Accettato' : 'In attesa'}
                            </TableCol>
                            <TableCol
                                className="prenotazioni__cta"
                            >
                                <div className='approve__row--cta'>

                                    <Button
                                        className={`cta cta--secondary-ok cta--approve`}
                                        onClick={() => handleApprovation('approved', r.id)}
                                        // onClick={() => handleDeleteRow(r.seat.name, 'DELETESINGLE', username, r)}
                                        type='button'
                                        icon={<TbClipboardCheck size={18} />}
                                        text=''
                                    />
                                    <Button
                                        className={`cta cta--secondary-delete`}
                                        onClick={() => handleApprovation('disapproved', r.id)}
                                        // onClick={() => handleDeleteRow(r.seat.name, 'DELETESINGLE', username, r)}
                                        type='button'
                                        icon={<RiDeleteBin3Line size={18} />}
                                        text=''
                                    />
                                </div>

                            </TableCol>
                        </TableRow>
                    )
                })}
            </>
        )
    } else {
        tableContent = <>
            <TableRow
                key={'not-found'}
                className=''
            >
                <TableCol
                    className="prenotazioni__empty"
                >
                    <p>Non sono presenti richieste da approvare.</p>
                </TableCol>
            </TableRow>
        </>
    }

    console.log('RESERVES', reserves)

    return (
        <div
            className="prenotazioni__container"
        >

            <div className="prenotazioni__wrapper">
                <div className="prenotazioni__header">

                    <h2
                        className="table__title txt-h3"
                    >
                        Da approvare
                    </h2>
                </div>
                <Table>
                    <TableHeader
                        headerColumns={['Data', 'Orario', 'Postazione', 'Utente', 'Stato', '']}
                    />
                    <TableBody>
                        {isLoading
                            ? <TableRow
                                key={'spinner'}
                                className=''
                            >
                                <TableCol
                                    className="prenotazioni__spinner"
                                ><Spinner />
                                </TableCol>
                            </TableRow>
                            : tableContent
                        }
                    </TableBody>
                </Table>
                {/* <Modal
                    seatName={modalData.seatName}
                    action={modalData.action}
                    username={modalData.username}
                    reserveData={modalData.reserveData}
                    setReserveData={null}
                    fromTo={null}
                    setHandleDelete={setHandleDelete}
                /> */}
            </div>
        </div>
    )
}

export default pending