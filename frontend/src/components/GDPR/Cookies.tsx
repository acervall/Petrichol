import { Fragment, useContext, useEffect, useState } from 'react'
import Context from '../../util/ Context'
import { Popover, Transition } from '@headlessui/react'

function AcceptCookies({ consent }: { consent: boolean }) {
  const local = localStorage.getItem('userId')
  const session = sessionStorage.getItem('userId')

  if (consent) {
    if (!local && !!session) {
      localStorage.setItem('userId', session)
    }
    sessionStorage.clear()
    localStorage.setItem('Cookies', JSON.stringify(true))
  } else if (!consent) {
    if (!!local && !session) {
      sessionStorage.setItem('userId', local)
    }
    localStorage.clear()
    sessionStorage.setItem('Cookies', JSON.stringify(true))
  }
}

export function Cookies() {
  const { setAcceptCookies } = useContext(Context)
  const showCookies = localStorage.getItem('Cookies') || sessionStorage.getItem('Cookies')
  const [open, setOpen] = useState(true)
  const [readMore, setReadMore] = useState(false)

  useEffect(() => {
    if (showCookies) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [showCookies])

  const handleClick = ({ consent }: { consent: boolean }) => {
    setAcceptCookies(consent)
    AcceptCookies({ consent: consent })
    setOpen(false)
  }
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Popover className="fixed inset-x-0 bottom-0 p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-10 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="fixed inset-x-0 bottom-0 flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Popover.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <div className="text-base font-semibold leading-6 text-gray-900">Cookie Consent</div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            This website uses cookies to enhance your experience.
                            <span>
                              Learn more about how we use cookies in our{' '}
                              <button
                                className="text-blue-500 underline focus:outline-none"
                                onClick={() => setReadMore(!readMore)}
                              >
                                Cookie Policy
                              </button>
                              .
                            </span>
                            {readMore && (
                              <>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                    This website respects your privacy and offers you a choice regarding the storage of
                                    login information:
                                  </p>
                                  <ul className="list-inside list-disc">
                                    <li>
                                      <strong>Accept Cookies:</strong>
                                      <br />
                                      If you choose to accept cookies, we will store your login information in local
                                      storage for a more personalized and convenient experience.
                                    </li>
                                    <li>
                                      <strong>Decline Cookies:</strong>
                                      <br />
                                      If you decline cookies, we will use session storage to store your login
                                      information for the duration of your current browser session, prioritizing
                                      privacy.
                                    </li>
                                  </ul>
                                  <p className="mt-2 text-sm text-gray-500">
                                    <strong>Your Privacy, Your Choice</strong>
                                    <br />
                                    By using this website, you have the option to accept or decline cookies based on
                                    your preference.
                                  </p>
                                </div>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mx-3 mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto"
                      onClick={() => handleClick({ consent: false })}
                    >
                      Don't Accept
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto"
                      onClick={() => handleClick({ consent: true })}
                    >
                      Accept
                    </button>
                  </div>
                </Popover.Panel>
              </Transition.Child>
            </div>
          </div>
        </Popover>
      </Transition.Root>
    </>
  )
}
