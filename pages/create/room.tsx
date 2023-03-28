import axios from "axios"
import { GetStaticProps } from "next"
import { useEffect, useState, useRef } from "react"
import HandleRoom from "../../components/handleRoom"
import prisma from "../../lib/prisma"
import CreateAction from "../../components/Create/CreateAction"

type Domain = {
  id: string,
  name: string,
  office: Office[]
}

type Office = {
  id: string,
  name: string,
  domainId: string,
  room: Room[]
}

type Room = {
  id: string,
  name: string,
  officeId: string
}

type OptionItem = {
  value: string,
  label: string
}

function Room() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedDomain, setSelectedDomain] = useState<OptionItem>({ value: '', label: 'Seleziona un dominio' });
  const [selectedOffice, setSelectedOffice] = useState<OptionItem>({ value: '', label: 'Seleziona un ufficio' });
  const [selectedRoom, setSelectedRoom] = useState<OptionItem>({ value: '', label: 'Seleziona un ufficio' });
  const [stepperState, setStepperState] = useState<number>()
  const [stepperLabel, setStepperLabel] = useState<string>('')
  const [openDominio, setOpenDominio] = useState<boolean>(false)
  const [openOffice, setOpenOffice] = useState<boolean>(false)
  const [openStanza, setOpenStanza] = useState<boolean>(false)

  const domainRef = useRef<any>(null)
  const officeRef = useRef<any>(null)
  const roomRef = useRef<any>(null)

  useEffect(() => {
    // UseRef per controllare se il click è interno

    const handleClickOutside = (event: any) => {
      if (domainRef.current && !domainRef.current.contains(event.target)) {
        setOpenDominio(false)
      }
      if (officeRef.current && !officeRef.current.contains(event.target)) {
        setOpenOffice(false)
      }
      if (roomRef.current && !roomRef.current.contains(event.target)) {
        setOpenStanza(false)
      }

    };
    window.addEventListener('click', handleClickOutside, true);
    return () => {
      window.removeEventListener('click', handleClickOutside, true);
    };


  }, [])

  useEffect(() => {
    const trueCount = [Boolean(selectedDomain.value), Boolean(selectedOffice.value), Boolean(selectedRoom.value)].reduce((count: any, bool: boolean) => count + bool, 0);
    setStepperState(trueCount)
  }, [selectedDomain, selectedOffice, selectedRoom])

  useEffect(() => {
    const getDomains = async () => {
      const res = (await axios.get("/api/domain")).data
      if (res) setDomains(res)
    }
    getDomains()
  }, [])

  useEffect(() => {
    const domain = domains.find((domain) => domain.id === selectedDomain.value)
    setSelectedOffice({ label: 'Seleziona un ufficio', value: '' })
    setSelectedRoom({ label: 'Seleziona una stanza', value: '' })
    if (domain && domain.hasOwnProperty("office") && domain.office.length > 0) {
      setOffices(domain.office)
      // if (domain.office[0]) setSelectedOffice(domain.office[0].id)
      // console.log(selectedOffice)
    } else {
      setOffices([])
    }
  }, [selectedDomain])

  useEffect(() => {
    setSelectedRoom({ label: 'Seleziona una stanza', value: '' })
    const office = offices.find((office) => office.id === selectedOffice.value)
    if (office && office.hasOwnProperty("room") && office.room.length > 0) {
      setRooms(office.room)
      // if (office.room[0]) setSelectedRoom(office.room[0].id)
    }
  }, [selectedOffice])

  const handleAddDomain = async () => {
    const value = (document.getElementById("inputDomain") as HTMLInputElement).value
    const res = await axios.post("/api/domain", { name: value })
    setDomains([...domains, res.data])
  }

  const handleAddOffice = async () => {
    const value = (document.getElementById("inputOffice") as HTMLInputElement).value
    const res = await axios.post("/api/office", { name: value, domainId: selectedDomain.value })
    setOffices([...offices, res.data])
  }

  const handleAddRoom = async () => {
    const value = (document.getElementById("inputRoom") as HTMLInputElement).value
    const res = await axios.post("/api/room", { name: value, officeId: selectedOffice.value })
    console.log('RESPONSE',res)
    setRooms([...rooms, res.data])
  }

  const handleSelectDomain = () => {
    // setSelectedDomain(e.target.value)
    setOpenDominio(prev => !prev)
  }

  const handleSelectOffice = () => {
    // setSelectedOffice(e.target.value)
    setOpenOffice(prev => !prev)
  }

  const handleSelectRoom = () => {
    // setSelectedRoom(e.target.value)
    setOpenStanza(prev => !prev)
  }

  useEffect(() => {
    if(stepperState === 0) {
      setStepperLabel('un dominio')
    } else if(stepperState === 1) {
      setStepperLabel('un ufficio')
    } else if(stepperState === 2) {
      setStepperLabel('una stanza')
    }
  }, [stepperState])

  return (
    <div
      className="room-create__container"
    >
      <h1>
        Crea o seleziona {stepperLabel}
      </h1>
      <div className="room-create__body">
        <CreateAction
          refState={domainRef}
          label="Dominio"
          defaultSelect="Seleziona un dominio"
          selectObj={selectedDomain}
          handleSelect={handleSelectDomain}
          openOption={openDominio}
          setSelect={setSelectedDomain}
          optionList={domains}
        />
        <input id="inputDomain" type="text"></input>
        <button onClick={() => { handleAddDomain() }}>Add</button>

        {domains.length > 0 && selectedDomain.value &&
        <>
          <CreateAction
            refState={officeRef}
            label="Ufficio"
            defaultSelect="Seleziona un ufficio"
            selectObj={selectedOffice}
            handleSelect={handleSelectOffice}
            openOption={openOffice}
            setSelect={setSelectedOffice}
            optionList={offices}
          />
            <input id="inputOffice" type="text"></input>
            <button onClick={() => {handleAddOffice()}}>Add</button>
        </>
        }

        { offices.length > 0 && selectedOffice.value && 
          <>
            <CreateAction
              refState={roomRef}
              label="Stanza"
              defaultSelect="Seleziona una stanza"
              selectObj={selectedRoom}
              handleSelect={handleSelectRoom}
              openOption={openStanza}
              setSelect={setSelectedRoom}
              optionList={rooms}
            />
              <input id="inputRoom" type="text"></input>
              <button onClick={() => {handleAddRoom()}}>Add</button>
          </>
        }
        {selectedRoom.value && <HandleRoom roomId={selectedRoom.value} create={true} />}
      </div>


    </div>
  )
}

export default Room

export const getStaticProps: GetStaticProps = async () => {
  const domains = await prisma.domain.findMany({
    include: {
      office: {
        include: { room: true }
      }
    }
  })
  return { props: { domains } }
}