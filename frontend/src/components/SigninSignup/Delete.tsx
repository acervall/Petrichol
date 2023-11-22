import useUserActions from '../../store/userStore'

function DeleteAccount() {
  const { deleteUser } = useUserActions()

  return (
    <button
      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => deleteUser.mutateAsync()}
    >
      Delete Account
    </button>
  )
}

export default DeleteAccount
