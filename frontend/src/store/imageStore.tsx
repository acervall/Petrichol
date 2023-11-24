import axios from 'axios'
import { Image } from '../lib/types'

export const GetImages = async (userId: number): Promise<Image[]> => {
  try {
    const response = await axios.post<{ success: boolean; images: Image[] }>(`/api/images/getImages`, {
      userId,
    })

    const { success, images } = response.data

    if (success) {
      console.log(images)
      return images
    } else {
      throw new Error('Failed to get images')
    }
  } catch (error) {
    console.error('Error getting images:', error)
    throw new Error('Error getting images')
  }
}

export const UploadImage = async (
  userId: number,
  formData: { imageUrl: string; altText: string; isActive: boolean },
): Promise<Image> => {
  try {
    const response = await axios.post<Image>(`/api/images/addImage`, {
      userId,
      imageUrl: formData.imageUrl,
      altText: formData.altText,
      isActive: formData.isActive,
    })

    const image = response.data

    return image
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Error uploading image')
  }
}

export const UpdateActiveImage = async (userId: number, imageId: number) => {
  try {
    await axios.put(`/api/images/updateActiveImage`, {
      userId,
      imageId,
    })
  } catch (error) {
    console.error('Error updating active image:', error)
  }
}
