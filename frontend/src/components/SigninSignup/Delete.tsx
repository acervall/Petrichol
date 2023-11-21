import useUserActions from '../../store/userStore'

function DeleteAccount({ id }: { id: number }) {
  const { deleteUser } = useUserActions()
  console.log(id)

  return <button onClick={() => deleteUser.mutateAsync(id)}>Delete Account</button>
  // return <button onClick={() => console.log(id)}>Delete Account</button>
}

export default DeleteAccount
