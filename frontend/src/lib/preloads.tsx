import { lazyWithPreload } from 'react-lazy-with-preload'

export const Home = lazyWithPreload(() => import('../views/Home'))
export const SigninSignup = lazyWithPreload(() => import('../views/SigninSignup'))
export const Lists = lazyWithPreload(() => import('../views/Lists'))
export const UserProfile = lazyWithPreload(() => import('../views/UserProfile'))
export const ListDetails = lazyWithPreload(() => import('../components/ListDetails'))
export const FolderDetails = lazyWithPreload(() => import('../components/FolderDetails'))
