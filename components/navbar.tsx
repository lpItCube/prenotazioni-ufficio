import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function Navbar() {
  useEffect(() => {
    const toggleButton = document.getElementsByClassName("toggle-button")[0]
    const navbarLinks = document.getElementsByClassName("navbar-links")[0]

    toggleButton.addEventListener("click", () => {
      console.log("clicked")
      navbarLinks.classList.toggle("active")
    })
  }, [])

  return (
    <div className="navbar">
      <div className="brand-title">
          <img src="../logo.png"  />
      </div>
      <div className="content-user">
          <img className="user-img" src="../user.gif"  />
          <h2 className="user-name-menu">Nome utente</h2>
      </div>
      <div className="navbar-links">
        <ul>
          <CustomLink href="/prenota">Prenota</CustomLink>
          <CustomLink href="/profilo">Profilo</CustomLink>
        </ul>
        <p></p>
      </div>

      <a href="#" className="toggle-button">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </a>
    </div>
  )
}

function CustomLink({ href, children }: any) {
  const path = useRouter().pathname
  return (
    <li className={path === href ? "active" : ""}>
      <Link href={href}>
        {children}
      </Link>
    </li>
  )
}

export default Navbar
