import axios from "axios"
import { GetStaticProps } from "next"
import { useEffect, useState } from "react"
import HandleRoom from "../components/handleRoom"
import prisma from "../lib/prisma"

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

function Admin() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string|undefined>(undefined);
  const [selectedOffice, setSelectedOffice] = useState<string|undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<string|undefined>(undefined);

  useEffect(() => {
    const getDomains = async() => {
      const res = (await axios.get("/api/domain")).data
      if(res) setDomains(res)
    }
    getDomains()
  }, [])

  useEffect(() => {
    const domain = domains.find((domain) => domain.id === selectedDomain)
    if (domain && domain.office.length > 0) {
      setOffices(domain.office)
      if (domain.office[0]) setSelectedOffice(domain.office[0].id)
    }
  }, [selectedDomain])

  useEffect(() => {
    const office = offices.find((office) => office.id === selectedOffice)
    if (office && office.room.length > 0) {
      setRooms(office.room)
      if (office.room[0]) setSelectedRoom(office.room[0].id)
    }
  }, [selectedOffice])

  const handleAddDomain = async() => {
    const value = (document.getElementById("inputDomain") as HTMLInputElement).value
    const res = await axios.post("/api/domain", {name: value})
    setDomains([...domains, res.data])
  }

  const handleAddOffice = async() => {
    const value = (document.getElementById("inputOffice") as HTMLInputElement).value
    const res = await axios.post("/api/office", {name: value, domainId: selectedDomain})
    setOffices([...offices, res.data])
  }

  const handleAddRoom = async() => {
    const value = (document.getElementById("inputRoom") as HTMLInputElement).value
    const res = await axios.post("/api/room", {name: value, officeId: selectedOffice})
    setRooms([...rooms, res.data])
  }

  const handleSelectDomain = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDomain(e.target.value)
  }

  const handleSelectOffice = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOffice(e.target.value)
  }

  const handleSelectRoom = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    setSelectedRoom(e.target.value)
  }

  useEffect(() => {

  }, [selectedRoom])

  return (
    <div>
      <select value={selectedDomain} onChange={handleSelectDomain}>
        <option value="">-- Select a domain --</option>
        {domains.map((domain, key) =>
          <option value={domain.id} key={key}>{domain.name}</option>
        )}
      </select>
      <input id="inputDomain" type="text"></input>
      <button onClick={() => {handleAddDomain()}}>Add</button>

      { domains.length > 0 && selectedDomain && 
        <div>
          
          <select value={selectedOffice} onChange={handleSelectOffice}>
            <option value="">-- Select an office --</option>
            {offices.map((office, key) => 
              <option value={office.id} key={key}>{office.name}</option>
            )}
          </select>
          <input id="inputOffice" type="text"></input>
          <button onClick={() => {handleAddOffice()}}>Add</button>
        </div>
      }

      { offices.length > 0 && selectedOffice && 
        <div>
          <select value={selectedRoom} onChange={handleSelectRoom}>
            <option value="">-- Select a room --</option>
            {rooms.map((room, key) => 
              <option value={room.id} key={key}>{room.name}</option>
            )}
          </select>
          <input id="inputRoom" type="text"></input>
          <button onClick={() => {handleAddRoom()}}>Add</button>
        </div>
      }

      { selectedRoom && <HandleRoom roomId={selectedRoom} create={true} /> }

    </div>
  )
}

export default Admin

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