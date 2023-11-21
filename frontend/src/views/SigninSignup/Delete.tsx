import useUserActions from '../../store/userStore'

function DeleteAccount({ id }: { id: number }) {
  const { deleteUser } = useUserActions()

  return <button onClick={() => deleteUser.mutateAsync(id)}>Delete Account</button>
}

export default DeleteAccount
