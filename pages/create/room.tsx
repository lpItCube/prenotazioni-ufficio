import axios from "axios"
import { GetStaticProps } from "next"
import { useEffect, useState, useRef } from "react"
import HandleRoom from "../../components/handleRoom"
import prisma from "../../lib/prisma"
import CreateAction from "../../components/Create/CreateAction"
import Stepper from "../../components/Create/Stepper"
import { motion, AnimatePresence } from 'framer-motion';
import Button from "../../components/Ui/Button"
import { Colors } from "../../components/Ui/Colors"
import StepperNavigator from "../../components/Create/StepperNavigator"
import { DEFAULT_DOMAIN_VALUE, DEFAULT_OFFICE_VALUE, DEFAULT_ROOM_VALUE, DirectionMode, StepperState } from "../../_shared"


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
  const [selectedDomain, setSelectedDomain] = useState<OptionItem>(DEFAULT_DOMAIN_VALUE);
  const [selectedOffice, setSelectedOffice] = useState<OptionItem>(DEFAULT_OFFICE_VALUE);
  const [selectedRoom, setSelectedRoom] = useState<OptionItem>(DEFAULT_ROOM_VALUE);
  const [stepperState, setStepperState] = useState<number>(0)
  const [openDominio, setOpenDominio] = useState<boolean>(false)
  const [openOffice, setOpenOffice] = useState<boolean>(false)
  const [openStanza, setOpenStanza] = useState<boolean>(false)
  const [createName, setCreateName] = useState<string>('')
  const [direction, setDirection] = useState<number>(DirectionMode.POSITIVE)

  const officeRef = useRef<any>(null)
  const domainRef = useRef<any>(null)
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
    setTimeout(() => {
      setStepperState(trueCount)
      setCreateName('')
      setDirection(DirectionMode.POSITIVE)
    },100)
  }, [selectedDomain, selectedOffice, selectedRoom])

  useEffect(() => {
    const getDomains = async () => {
      const res = (await axios.get("/api/domain")).data
      if (res) setDomains(res)
    }
    getDomains()

    const domain = domains.find((domain) => domain.id === selectedDomain.value)
    if (domain && domain.hasOwnProperty("office") && domain.office.length > 0) {
      setOffices(domain.office)
    } else {
      setOffices([])
    }

    const office = offices.find((office) => office.id === selectedOffice.value)
    if (office && office.hasOwnProperty("room") && office.room.length > 0) {
      setRooms(office.room)
    } else {
      setRooms([])
    }

    console.log('SELECTED', selectedOffice)
  }, [selectedDomain, selectedOffice, selectedRoom])


  useEffect(() => {
    setSelectedOffice({ label: 'Seleziona', value: '' })
    setSelectedRoom({ label: 'Seleziona', value: '' })
  }, [selectedDomain])


  useEffect(() => {
    setSelectedRoom({ label: 'Seleziona', value: '' })
  }, [selectedOffice])


  const handleCreation = async (type: number) => {
    if (type === StepperState.DOMAIN) {
      console.log('CREATE', createName)
      const res = await axios.post("/api/domain", { name: createName })
      setDomains([...domains, res.data])
      setSelectedDomain({ value: res.data.id, label: res.data.name })
    } else if (type === StepperState.OFFICE) {
      console.log('CREATE', createName, selectedDomain.value)
      const res = await axios.post("/api/office", { name: createName, domainId: selectedDomain.value })
      setOffices([...offices, res.data])
      setSelectedOffice({ value: res.data.id, label: res.data.name })
    } else if (type === StepperState.ROOM) {
      console.log('CREATE', createName, selectedOffice.value)
      const res = await axios.post("/api/room", { name: createName, officeId: selectedOffice.value })
      setRooms([...rooms, res.data])
      setSelectedRoom({ value: res.data.id, label: res.data.name })
    }
    setCreateName('')
  }


  const handleSelectDomain = () => {
    setOpenDominio(prev => !prev)
  }

  const handleSelectOffice = () => {
    setOpenOffice(prev => !prev)
  }

  const handleSelectRoom = () => {
    setOpenStanza(prev => !prev)
  }


  return (
    <div
      className="room-create__container"
    >
      <div className={`room-create__body creation-stepper__container ${stepperState > StepperState.ROOM ? 'creation-stepper__static' : 'creation-stepper__active'}`}>
        <div className="creation-stepper__navigation">

          <div
            className={`creation-stepper__element ${stepperState === StepperState.DOMAIN ? '' : 'disabled'}`}
          >
            <CreateAction
              label="Dominio"
              defaultSelect="Seleziona"
              refState={domainRef}
              selectObj={selectedDomain}
              openOption={openDominio}
              optionList={domains}
              isActive={stepperState === StepperState.DOMAIN}
              currentStepper={StepperState.DOMAIN}
              stepperState={stepperState}
              createName={createName}
              direction={direction}
              setDirection={setDirection}
              setCreateName={setCreateName}
              handleCreation={handleCreation}
              handleSelect={handleSelectDomain}
              setSelect={setSelectedDomain}
              setStepperState={setStepperState}
              setSelectedDomain={setSelectedDomain}
              setSelectedOffice={setSelectedOffice}
              setSelectedRoom={setSelectedRoom}
            />
          </div>

          <div
            className={`creation-stepper__element ${domains.length > 0 && selectedDomain.value && stepperState === StepperState.OFFICE ? '' : 'disabled'}`}
          >
            <CreateAction
              label="Ufficio"
              defaultSelect="Seleziona"
              refState={officeRef}
              selectObj={selectedOffice}
              openOption={openOffice}
              optionList={offices}
              isActive={domains.length > 0 && Boolean(selectedDomain.value) && stepperState === StepperState.OFFICE}
              currentStepper={StepperState.OFFICE}
              stepperState={stepperState}
              createName={createName}
              direction={direction}
              setDirection={setDirection}
              setCreateName={setCreateName}
              handleCreation={handleCreation}
              handleSelect={handleSelectOffice}
              setSelect={setSelectedOffice}
              setStepperState={setStepperState}
              setSelectedDomain={setSelectedDomain}
              setSelectedOffice={setSelectedOffice}
              setSelectedRoom={setSelectedRoom}
            />
          </div>

          <div
            className={`creation-stepper__element ${offices.length > 0 && selectedOffice.value && stepperState === StepperState.ROOM ? '' : 'disabled'}`}
          >
            <CreateAction
              label="Stanza"
              defaultSelect="Seleziona"
              refState={roomRef}
              selectObj={selectedRoom}
              openOption={openStanza}
              optionList={rooms}
              isActive={offices.length > 0 && Boolean(selectedOffice.value) && stepperState === StepperState.ROOM}
              currentStepper={StepperState.ROOM}
              stepperState={stepperState}
              createName={createName}
              direction={direction}
              setDirection={setDirection}
              setCreateName={setCreateName}
              handleCreation={handleCreation}
              handleSelect={handleSelectRoom}
              setSelect={setSelectedRoom}
              setStepperState={setStepperState}
              setSelectedDomain={setSelectedDomain}
              setSelectedOffice={setSelectedOffice}
              setSelectedRoom={setSelectedRoom}
            />
          </div>
        </div>

      </div>
      {selectedRoom.value && <HandleRoom roomId={selectedRoom.value} create={true} />}
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