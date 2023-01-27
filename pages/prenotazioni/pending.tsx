import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import axios from 'axios'

// Redux
import { useDispatch } from "react-redux"
import { setPendingNotification } from '../../features/notificationSlice'

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
}: any) {

    const session = useSession()
    const dispatch = useDispatch()
    const [reserves, setReserves] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [hitManageButton, setHitManageButton] = useState({ loading: false, id: null })


    useEffect(() => {
        setIsLoading(true)
        const getReserves = async () => {
            const response = await axios.get(`/api/reserve/pending`)
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


    const handleApprovation = async (status: any, id: any) => {
        setHitManageButton({ loading: true, id })
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
        dispatch(setPendingNotification({ pending: reserves.length - 1 }))
        setHitManageButton({ loading: false, id: null })
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
                                {hitManageButton.loading && hitManageButton.id === r.id
                                    ?   <Spinner/>
                                    :   <div className='approve__row--cta'>

                                            <Button
                                                className={`cta cta--secondary-ok cta--approve`}
                                                onClick={() => handleApprovation('approved', r.id)}
                                                type='button'
                                                icon={<TbClipboardCheck size={18} />}
                                                text=''
                                            />
                                            <Button
                                                className={`cta cta--secondary-delete`}
                                                onClick={() => handleApprovation('disapproved', r.id)}
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