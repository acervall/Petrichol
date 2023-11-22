import Folder from '../components/Folder'

import ListDisplay from '../components/ListDisplay'

function Lists() {
  return (
    <>
      <h1 className="mt-10 text-center text-lg font-semibold">Folders</h1>
      <Folder />
      <h1 className="mt-10 text-center text-lg font-semibold">Lists</h1>
      <ListDisplay />
    </>
  )
}

export default Lists
