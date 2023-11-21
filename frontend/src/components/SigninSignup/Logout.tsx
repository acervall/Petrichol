import useUserActions from '../../store/userStore'

function Logout() {
  const { logoutUser } = useUserActions()

  return <button onClick={() => logoutUser.mutateAsync()}>Log out</button>
}

export default Logout
