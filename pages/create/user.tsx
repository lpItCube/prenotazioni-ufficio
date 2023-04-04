import axios from "axios";
import { useEffect, useState } from "react";

type Domain = {
  id: string,
  name: string,
  user: User[]
}

type User = {
  id: string,
  domainId: string,
  username: string,
  role: Role
}

enum Role {
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
  USER = "USER"
}


function User() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string|undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<string|undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<string|undefined>(undefined);

  useEffect(() => {
    const getDomains = async() => {
      const res = (await axios.get("/api/domain")).data
      if(res) setDomains(res)
    }
    getDomains()
  }, [])

  useEffect(() => {
    const domain = domains.find((d: Domain) => d.id === selectedDomain)
    if (domain && domain.user.length > 0) {
      setUsers(domain.user)
    } 
  }, [selectedDomain])

  const handleSelectDomain = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDomain(e.target.value)
  }
  
  const handleSelectRole = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value)
  }

  const handleAddUser = async() => {
    const username = (document.getElementById("username") as HTMLInputElement).value
    const password = (document.getElementById("password") as HTMLInputElement).value
    const role = selectedRole === "ADMIN" ? Role.ADMIN : Role.USER
    const userToAdd = { username: username, password: password, role: role, domainId: selectedDomain}
    await axios.post("/api/users", userToAdd)
  }

  return (
    <div>
      <select value={selectedDomain} onChange={handleSelectDomain}>
        <option value="">-- Select a domain --</option>
        {domains.map((domain, key) =>
          <option value={domain.id} key={key}>{domain.name}</option>
        )}
      </select>
      { selectedDomain && selectedDomain.length > 0 && 
        <div>
          <div style={{border: "1px solid black", padding: "2px"}}>
            <div>
              <label>Username </label>
              <input id="username" type="text" placeholder="Inserire username"></input>
            </div>
            <div>
              <label>Password </label>
              <input id="password" type="text" placeholder="Inserire password"></input>
            </div>
            <label>Ruolo </label>
            <select onChange={handleSelectRole}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <div>
              <button onClick={handleAddUser}> Aggiungi Utente </button>
            </div>
          </div>
          { users && users.length > 0 && 
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
              {
                users.map((u: User, i: number) => {
                  return (
                  <tr key={i}>
                    <td>{u.username}</td>
                    <td>{u.role}</td>
                  </tr>
                  )
                })
              }
              </tbody>
            </table>
          }
        </div>
      }
    </div>
  )
}

export default User