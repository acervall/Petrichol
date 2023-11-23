import { useContext } from 'react'
import { Link } from 'react-router-dom'
import * as Preloads from '../lib/preloads'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { UserProps } from '../lib/types'
import Context from '../util/ Context'

function Navbar() {
  const { loggedIn } = useContext<UserProps>(Context)

  return (
    <>
      {loggedIn && (
        <div>
          <nav className="fixed bottom-0 left-0 z-50 w-full bg-stone-300 p-5">
            <ul className="flex justify-between lg:justify-around">
              <li>
                <Link onMouseOver={Preloads.Home.preload} onTouchStart={Preloads.Home.preload} to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-home"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link onMouseOver={Preloads.Lists.preload} onTouchStart={Preloads.Lists.preload} to="/lists">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-align-justify"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  onMouseOver={Preloads.UserProfile.preload}
                  onTouchStart={Preloads.UserProfile.preload}
                  to="/profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}

export default Navbar
