import List from './List'
import Folder from './Folder'

function HomeScreen() {
  return (
    <>
      <>
        <h1 className="mt-10 text-center text-lg font-semibold">Welcome home!</h1>
        <Folder />
        <List />
      </>
    </>
  )
}

export default HomeScreen
