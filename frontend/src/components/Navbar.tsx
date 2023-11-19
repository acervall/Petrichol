import { Link } from 'react-router-dom'
import * as Preloads from '../lib/preloads'

function Navbar() {
  return (
    <>
      <nav className="mx-auto">
        <ul className="flex space-x-4">
          <li>
            <Link onMouseOver={Preloads.Home.preload} onTouchStart={Preloads.Home.preload} to="/">Home</Link>
          </li>
          <li>
            <Link onMouseOver={Preloads.Lists.preload} onTouchStart={Preloads.Lists.preload} to="/lists">Lists</Link>
          </li>
          <li>
            <Link onMouseOver={Preloads.UserProfile.preload} onTouchStart={Preloads.UserProfile.preload} to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar
