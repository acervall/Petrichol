import { SetStateAction } from 'react'

export interface ApiResponse<T> {
  success: boolean
  message: string
  user: T
}

export interface User {
  id?: number
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface UserAndSettings {
  id?: number
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  opacity?: number
  background_color?: string
}

export interface UserProps {
  acceptCookies: boolean
  setUserId: React.Dispatch<React.SetStateAction<number>>
  loggedIn: boolean
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  userId: number
}

export interface List {
  folder_id: number | null
  homepage: boolean
  id: number
  name: string
  user_id: number
}

export interface FolderWithList {
  id: number
  name: string
  lists: List[]
}

export interface Task {
  id?: number
  name?: string
  user_id?: number
  checked?: boolean
}

export interface ListData {
  listName: string
  tasks: Task[]
}

export interface ListDataId {
  listId: SetStateAction<undefined>
  listName: string
  tasks: Task[]
}

export interface Folder {
  id: number
  name: string
  user_id: number
}

export interface ErrorObject {
  message: string
}

export interface Image {
  id: number
  url: string
  alt: string | null
  user_id: number
  active: boolean
}
