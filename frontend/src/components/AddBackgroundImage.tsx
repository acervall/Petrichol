import { useContext, useState, useEffect } from 'react'
import Context from '../util/ Context'

import { Image } from '../lib/types'
import { Switch } from '@headlessui/react'

import { GetImages, UploadImage, UpdateActiveImage } from '../store/imageStore'

function AddBackgroundImage() {
  const { userId } = useContext(Context)
  const [formData, setFormData] = useState({
    imageUrl: '',
    altText: '',
    isActive: true,
  })
  const [images, setImages] = useState<Image[]>([])

  const fetchImages = async () => {
    try {
      const imagesData = await GetImages(userId)
      setImages(imagesData)
    } catch (error) {
      console.error('Error getting images:', error)
    }
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleImageClick = async (imageId: number) => {
    try {
      await UpdateActiveImage(userId, imageId)
      fetchImages()
    } catch (error) {
      console.error('Error during form submission:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const uploadedImage = await UploadImage(userId, formData)
      console.log('Image uploaded:', uploadedImage)
      fetchImages()
      setFormData({
        ...formData,
        imageUrl: '',
        altText: '',
      })
    } catch (error) {
      console.error('Error during form submission:', error)
    }
  }

  return (
    <>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Background Image</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Here you can upload a url to the photo you would like to have as your background.
        </p>

        <form method="POST" onSubmit={handleSubmit}>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="imageUrl" className="block text-sm font-medium leading-6 text-gray-900">
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="altText" className="block text-sm font-medium leading-6 text-gray-900">
                Alt Text
              </label>
              <input
                id="altText"
                name="altText"
                type="text"
                value={formData.altText}
                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between gap-x-6">
            <div className="flex-col items-center gap-x-6">
              <label htmlFor="isActive" className="mb-4 block text-sm font-medium leading-6 text-gray-900">
                Use as background
              </label>

              <Switch
                checked={formData.isActive}
                onChange={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`${
                  formData.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable cookie consent</span>
                <span
                  className={`${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white`}
                />
              </Switch>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Upload background image
              </button>
            </div>
          </div>
        </form>
        <div className="mt-6 flex gap-x-6">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.alt || 'Image'}
              className={`h-16 w-16 rounded-md object-cover shadow ${image.active ? 'border-2 border-indigo-600' : ''}`}
              onClick={() => handleImageClick(image.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default AddBackgroundImage
