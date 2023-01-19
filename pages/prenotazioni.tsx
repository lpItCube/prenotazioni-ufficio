import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

// Utils
import { getStringDate, getStringHours } from "../utils/datePharser"

// Redux
import { useDispatch, useSelector } from "react-redux"
import { toggleModal, setModalType } from "../features/modalSlice"
import { getUserName } from "../features/authSlice"

// Components 
import Spinner from "../components/Ui/Spinner"
import { Table, TableHeader, TableBody, TableRow, TableCol } from "../components/Ui/Table"
import Modal from "../components/modal"
import { RiDeleteBin3Line } from "react-icons/ri";
import Button from "../components/Ui/Button"

function Prenotazioni() {

  const dispatch = useDispatch()

  const session = useSession()
  const [reserves, setReserves] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [handleDelete, setHandleDelete] = useState(false)
  const [modalData, setModalData] = useState<any>({ seatName: '', action: '', username: '', reserveData: '' })
  const [filterMode, setFilterMode] = useState('byUser')

  const username = useSelector(getUserName)


  useEffect(() => {
    const getReserves = async () => {
      let sortedResponse
      if(filterMode === 'byUser') {
        const response = await axios.get(`/api/userReserves/${session.data?.user?.name}`)
        sortedResponse = response.data.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? 1 : -1)
      } else if(filterMode === 'today') {
        const date = new Date().toDateString()
        const response = await axios.get(`/api/userReserves/${session.data?.user?.name}`)
        const todayResponse = response.data.filter((res:any) => new Date(res.from).toDateString() === date)
        console.log('TODAY', todayResponse)
        sortedResponse = todayResponse.sort((a: any, b: any) => (a.seat.to > b.seat.to) ? 1 : -1)
      }
      setReserves(sortedResponse)
    }
    setIsLoading(true)
    if (session.status === "authenticated")

      getReserves()
    if (handleDelete) {
      setHandleDelete(false)
    }
    setIsLoading(false)
  }, [session, handleDelete, filterMode])


  // reserves && console.log('TODAY ALL',new Date(reserves[3].from).toDateString() ,'===', new Date().toDateString())

  const handleDeleteRow = (seatName: string, action: string, username: string, reserveData: any) => {
    setModalData({ seatName: seatName, action: action, username: username, reserveData: reserveData })
    dispatch(toggleModal(true));
    dispatch(setModalType('seats-modal'))
  }

  if (session.status === "authenticated" && !isLoading)
    return (
      <div
        className="prenotazioni__container"
      >
        <Table
          title='Le tue prenotazioni'
        >
          <div className="prenotazioni__filters">
            <button
              onClick={() => setFilterMode('byUser')}
            >Mie prenotazioni</button>
            <button
              onClick={() => setFilterMode('today')}
            >Today</button>
          </div>
          <TableHeader
            headerColumns={['Data', 'Orario', 'Postazione', '']}
          />
          <TableBody>
            {reserves.map((r: any, index: number) => {
              return (
                <TableRow
                  key={index}
                >
                  <TableCol
                    className=""
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
                     className="prenotazioni__cta"
                  >
                    <Button
                      className="cta cta--primary-delete cta__icon"
                      onClick={() => handleDeleteRow(r.seat.name, 'DELETE', username, r)}
                      type='button'
                      icon={<RiDeleteBin3Line size={18} />}
                      text='Elimina'
                    />
                  </TableCol>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Modal
          seatName={modalData.seatName}
          action={modalData.action}
          username={modalData.username}
          reserveData={modalData.reserveData}
          setReserveData={null}
          fromTo={null}
          setHandleDelete={setHandleDelete}
        />
      </div>
    )
  else return <div><Spinner /></div>
}

export default Prenotazioni