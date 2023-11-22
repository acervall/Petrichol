import { useContext } from 'react'
import { Link } from 'react-router-dom'
import * as Preloads from '../lib/preloads'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import test1 from '../assets/images/test1.jpeg'
import Context from '../util/ Context'

function Navbar() {
  const { loggedIn } = useContext(Context)

  return (
    <>
      {loggedIn && (
        <div className="relative h-44 lg:h-96">
          <LazyLoadImage
            alt="Petrichor"
            height="100%"
            effect="blur"
            src={test1}
            width="100%" // Set the width as needed
            className="absolute left-0 top-0 h-full w-full object-cover"
          />
          <nav className="absolute left-0 top-0 flex h-full w-full justify-end p-4">
            <ul className="z-10 flex justify-end space-x-4 py-2 pr-4 lg:space-x-8 lg:py-4 lg:pr-10 lg:text-xl">
              <li>
                <Link
                  className="hover:underline"
                  onMouseOver={Preloads.Home.preload}
                  onTouchStart={Preloads.Home.preload}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline"
                  onMouseOver={Preloads.Lists.preload}
                  onTouchStart={Preloads.Lists.preload}
                  to="/lists"
                >
                  Lists
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline"
                  onMouseOver={Preloads.UserProfile.preload}
                  onTouchStart={Preloads.UserProfile.preload}
                  to="/profile"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
          <h1 className="align-center absolute top-0 flex h-full w-full justify-center pl-36 pt-20 text-2xl lg:pl-60 lg:pt-40 lg:text-8xl">
            Petrichor
          </h1>
        </div>
      )}
    </>
  )
}

export default Navbar
