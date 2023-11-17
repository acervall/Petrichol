import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <>
      <nav className="mx-auto">
        <ul className="flex space-x-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/lists">Lists</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
