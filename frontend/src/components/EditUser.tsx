import { useState, useEffect, useContext } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { useLocalStorageId } from '../store/userStore'
import useUserActions from '../store/userStore'
import Logout from './SigninSignup/Logout'
import DeleteAccount from './SigninSignup/Delete'
import { User } from '../lib/types'
import { Switch } from '@headlessui/react'
import Context from '../util/ Context'
import { AcceptCookies } from './GDPR/Cookies'

function EditUser() {
  const { acceptCookies, setAcceptCookies } = useContext(Context)
  const { editUser, getUser } = useUserActions()

  const { data } = useLocalStorageId()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (data === undefined) {
          return
        }
        const userData = await getUser.mutateAsync(data)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (data) {
      fetchUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      if (!user) {
        return
      }
      await editUser.mutateAsync({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
      })
    } catch (error) {
      console.error('Edit error:', error)
    }
  }

  const handleSwitch = ({ checked }: { checked: boolean }) => {
    setAcceptCookies(checked)
    AcceptCookies({ consent: checked })
    console.log(checked)
  }

  return (
    <>
      {user && (
        <div className="sm:px-15 mx-auto max-w-7xl px-4 pt-16 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="space-y-12">
              <form>
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Here you can edit your user information.</p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                        Username
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="janesmith"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Photo
                      </label>
                      <div className="mt-2 flex items-center gap-x-3">
                        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                        <button
                          type="button"
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                        First name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          value={user.first_name}
                          onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Last name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          value={user.last_name}
                          onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>

              <div className="border-b border-gray-900/10 pb-5">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Cookies Consent</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Your privacy matters to us. Customize your cookie preferences below to enhance your browsing
                  experience while maintaining control over your data.
                </p>

                <div className="mt-10 space-y-10">
                  <Switch
                    checked={acceptCookies}
                    onChange={(checked) => handleSwitch({ checked: checked })}
                    className={`${
                      acceptCookies ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable cookie consent</span>
                    <span
                      className={`${
                        acceptCookies ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                </div>
              </div>
            </div>
            <div className="flex justify-between  py-5">
              <DeleteAccount />
              <Logout />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EditUser
