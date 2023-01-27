import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

// Utils
import { getStringDate, getStringHours } from '../../utils/datePharser'

// Redux
import { useDispatch, useSelector } from "react-redux"
import { toggleModal, setModalType } from "../../features/modalSlice"
// import { getUserName, getUserRole, getUserId } from "../../features/authSlice"

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";

// Components 
import Spinner from "../../components/Ui/Spinner"
import { Table, TableHeader, TableBody, TableRow, TableCol } from "../../components/Ui/Table"
import Modal from "../../components/modal"
import { RiDeleteBin3Line } from "react-icons/ri"
import Button from "../../components/Ui/Button"
import ReservesFilters from "../../components/Reserves/ReservesFilters"
import { IoEllipsisHorizontalOutline } from 'react-icons/io5'

function Prenotazioni() {

  const dispatch = useDispatch()

  const session = useSession()
  const [reserves, setReserves] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [handleDelete, setHandleDelete] = useState(false)
  const [modalData, setModalData] = useState<any>({ seatName: '', action: '', username: '', reserveData: '' })


  type stateObj = {
    label: String,
    value: String
  }

  const [filterMode, setFilterMode] = useState<stateObj>({ label: 'Le mie prenotazioni', value: 'myUser' })
  const [filterRoom, setFilterRoom] = useState<stateObj>({ label: 'Tutte le stanze', value: '' })
  const [filterDay, setFilterDay] = useState<stateObj>({ label: 'Tutte le date', value: '' })
  const [showFilters, setShowFilters] = useState(false)

  const { userData } = useAuthHook()

  const username = userData.name
  const userRole = userData.role
  const userId = userData.id

  useEffect(() => {
    setIsLoading(true)
  }, [])

  useEffect(() => {
    
    const getReserves = async (method:any) => {

      const response = await axios.get(`/api/reserve/currentUser?currentUser=${userId}&method=${method}`)
      let sortedResponse

      sortedResponse = response.data
      
      if (filterRoom.value !== '') {
        if (filterRoom.value === 'it') {
          sortedResponse = sortedResponse.filter((res: any) => res.seat.type === filterRoom.value)
        } else {
          sortedResponse = sortedResponse.filter((res: any) => res.seat.type === 'meet' || res.seat.type === 'meet-whole')
        }
      }
      if (filterDay.value !== '') {
        sortedResponse = sortedResponse.filter((res: any) => new Date(res.from).toDateString() === filterDay.value)
      }
      const reorderData = sortedResponse.sort((a: any, b: any) => (a.to > b.to) ? 1 : -1)
     
      setReserves(reorderData)
      setIsLoading(false)
    }

    if(userId) {
      setIsLoading(true)
      getReserves(filterMode.value)
    }

    if (handleDelete) {
      setHandleDelete(false)
    }
    // setIsLoading(false)
  }, [session, handleDelete, filterMode, filterRoom, filterDay, userId])


  const handleDeleteRow = (seatName: string, action: string, username: string, reserveData: any) => {
    setModalData({ seatName: seatName, action: action, username: username, reserveData: reserveData })
    dispatch(toggleModal(true));
    dispatch(setModalType('seats-modal'))
  }

  const handleShowFilters = () => {
    setShowFilters(prev => !prev)
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
                {(userRole === 'ADMIN' || userRole === 'USER' && r.user.id === userId) &&
                  <div className='approve__row--cta'>
                    <Button
                      className="cta cta--primary-delete cta__icon"
                      onClick={() => handleDeleteRow(r.seat.name, 'DELETESINGLE', username, r)}
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
          <p>Nessuna prenotazione presente nella ricerca:</p>
          <p className="semiBold">{filterMode.label} {filterRoom.label} {filterDay.label}</p>
        </TableCol>
      </TableRow>
    </>
  }

 
    return (
      <div
        className="prenotazioni__container"
      >
        <ReservesFilters
          userRole={userRole}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          filterDay={filterDay}
          setFilterDay={setFilterDay}
          filterRoom={filterRoom}
          setFilterRoom={setFilterRoom}
          showFilters={showFilters}
        />

        <div className="prenotazioni__wrapper">
          <div className="prenotazioni__header">

            <h2
              className="table__title txt-h3"
            >
              Prenotazioni
            </h2>
            <Button
              type='button'
              onClick={() => handleShowFilters()}
              className='cta cta--border-primary cta__icon cta__icon--reverse prenotazioni__filters-cta'
              text='Filtri'
              icon={<IoEllipsisHorizontalOutline size={18} />}

            />
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
          <Modal
            seatName={modalData.seatName}
            action={modalData.action}
            username={modalData.username}
            singleReserve={modalData.reserveData}
            setReserveData={null}
            fromTo={null}
            setHandleDelete={setHandleDelete}
          />
        </div>
      </div>
    )
  
}

export default Prenotazioni