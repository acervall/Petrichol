import { useContext, useState, useEffect } from 'react'
import Context from '../util/ Context'
import ToDoList from './ToDoList'
import { GetImages } from '../store/imageStore'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import useUserActions from '../store/userStore'
import { UserAndSettings } from '../lib/types'

function HomeScreen() {
  const { userId } = useContext(Context)
  const [activeImageUrl, setActiveImageUrl] = useState('')
  const [user, setUser] = useState<UserAndSettings | null>(null)
  const { getUser } = useUserActions()

  useEffect(() => {
    const fetchActiveImage = async () => {
      try {
        const imagesData = await GetImages(userId)
        const activeImage = imagesData.find((image) => image.active)

        if (activeImage) {
          setActiveImageUrl(activeImage.url)
        }
      } catch (error) {
        console.error('Error getting active image:', error)
      }
    }

    fetchActiveImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId === undefined) {
          return
        }
        const userData = await getUser.mutateAsync(userId)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (userId) {
      fetchUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return (
    <>
      <div className="relative">
        <div className=" fixed left-0 top-0 h-screen w-screen" style={{ backgroundColor: user?.background_color }}>
          {user && user.opacity && (
            <LazyLoadImage
              className={`fixed left-0 top-0 h-screen w-screen bg-cover bg-center `}
              style={{ backgroundImage: `url(${activeImageUrl})`, opacity: user.opacity / 100 }}
            />
          )}

          <div className="relative z-10">
            <h1 className="mt-10 text-center text-lg font-semibold">Welcome home!</h1>
            <ToDoList />
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeScreen
