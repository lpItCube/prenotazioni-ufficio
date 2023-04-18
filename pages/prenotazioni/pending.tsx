import { useEffect, useState } from 'react'

// Next
import { useSession } from "next-auth/react"

// Axios
import axios, { AxiosResponse } from 'axios'

// Redux
import { useDispatch } from "react-redux"
import { setPendingNotification } from '../../features/notificationSlice'

// Utils
import { getStringDate, getStringHours } from '../../utils/datePharser'

// Components 
import { Table, TableHeader, TableBody, TableRow, TableCol } from '../../components/Ui/Table'
import Button from '../../components/Ui/Button'
import Spinner from '../../components/Ui/Spinner'

// Icons
import { RiDeleteBin3Line } from "react-icons/ri"
import { TbClipboardCheck } from "react-icons/tb";

// Types
import { HitModalButton, Reserve, Room } from '../../types'

// Costants
import { APPROVE, DISAPPROVE } from '../../_shared'

interface PendingProps {
    setHitNotification: (nots: boolean) => void
}


const pending: React.FC<PendingProps> = (props): JSX.Element => {

    const { setHitNotification } = props

    const session = useSession()
    const dispatch = useDispatch()

    const [reserves, setReserves] = useState<Reserve[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hitManageButton, setHitManageButton] = useState<HitModalButton>({ loading: false, id: null })


    useEffect(() => {
        setIsLoading(true)
        const getReserves = async () => {
            const response: AxiosResponse<Reserve[]> = await axios.get(`/api/reserve/pending`)
            const reorderData = response.data.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? -1 : 1)
            setReserves(reorderData)
            setIsLoading(false)
        }
        getReserves()
    }, [session])

    useEffect(() => {
        dispatch(setPendingNotification({ pending: reserves.length }))
        setHitNotification(true)
    }, [reserves, session])


    const handleApprovation = async (status: number, id: string) => {
        setHitManageButton({ loading: true, id })
        if (status === APPROVE) {
            const reserve: Reserve = await (await axios.get(`/api/reserve/${id}`)).data
            console.log('type', reserve)
            const room = reserve?.seat?.room as Room
            const reservesInRoom = await (await axios.get(`/api/roomReserves/${room.id}`)).data
            const reserveToDelete: Reserve[] = reservesInRoom.filter((r: Reserve) =>
                !((new Date(r.from) > new Date(reserve.to as string)) ||
                    (r.to && new Date(r.to) < new Date(reserve.from as string)) && r.id !== id)
            )
            const awaitDelete = reserveToDelete.map((r: Reserve) => {
                return axios.delete("/api/reserve/" + r.id);
            });

            await Promise.all(awaitDelete);
            await axios.patch("/api/reserve/approveReserve", { id });

            const response: AxiosResponse<Reserve[]> = await axios.get(`/api/reserve/pending`)
            const reorderData = response.data.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? -1 : 1)
            setReserves(reorderData)
        } else {
            await axios.delete("/api/reserve/" + id);
            const response = await axios.get(`/api/reserve/pending`)
            const reorderData: Reserve[] = response.data.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? -1 : 1)
            setReserves(reorderData)
        }
        dispatch(setPendingNotification({ pending: reserves.length - 1 }))
        setHitManageButton({ loading: false, id: null })
        setHitNotification(true)
    }

    let tableContent: JSX.Element

    if (reserves.length > 0) {
        tableContent = (
            <>
                {reserves.map((r: Reserve, index: number) => {
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
                            {r.to && r.from && 
                                <TableCol
                                    className=""
                                >
                                    <p>{getStringHours(r.from) as string} - {getStringHours(r.to) as string}</p>
                                </TableCol>
                            }
                            <TableCol
                                className=""
                            >
                                {r?.seat?.name}
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
                                {hitManageButton.loading && hitManageButton.id === r.id
                                    ? <Spinner />
                                    : <div className='approve__row--cta'>

                                        <Button
                                            className={`cta cta--secondary-ok cta--approve`}
                                            onClick={() => handleApprovation(APPROVE, r.id)}
                                            type='button'
                                            icon={<TbClipboardCheck size={18} />}
                                            text=''
                                        />
                                        <Button
                                            className={`cta cta--secondary-delete`}
                                            onClick={() => handleApprovation(DISAPPROVE, r.id)}
                                            type='button'
                                            icon={<RiDeleteBin3Line size={18} />}
                                            text=''
                                        />
                                    </div>
                                }
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
            </div>
        </div>
    )
}

export default pending