import useUserActions from '../../store/userStore'

function Logout() {
  const { logoutUser } = useUserActions()

  return (
    <button className="text-sm font-semibold leading-6 text-gray-900" onClick={() => logoutUser.mutateAsync()}>
      Log out
    </button>
  )
}

export default Logout
