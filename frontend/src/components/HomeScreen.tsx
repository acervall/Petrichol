import { useContext, useState, useEffect } from 'react'
import Context from '../util/ Context'
import ToDoList from './ToDoList'
import { GetImages } from '../store/imageStore'

function HomeScreen() {
  const { userId } = useContext(Context)
  const [opacity, setOpacity] = useState(80)
  const [activeImageUrl, setActiveImageUrl] = useState('')

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

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOpacity(Number(value))
    console.log(value)
  }

  return (
    <>
      <div className="relative">
        <div
          className={`fixed left-0 top-0 h-screen w-screen bg-cover bg-center `}
          style={{ backgroundImage: `url(${activeImageUrl})`, opacity: opacity / 100 }}
        ></div>

        <div className="relative z-10">
          <h1 className="mt-10 text-center text-lg font-semibold">Welcome home!</h1>
          <ToDoList />
        </div>
      </div>
      <div className="fixed bottom-20 right-20">
        <label htmlFor="opacityInput" className="mr-2">
          Opacity:
        </label>
        <input id="opacityInput" type="range" min="0" max="100" value={opacity} onChange={handleOpacityChange} />
        <span className="ml-2">{opacity}%</span>
      </div>
    </>
  )
}

export default HomeScreen
