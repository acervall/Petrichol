import {  Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import UserProfile from './views/UserProfile'
import Lists from './views/Lists'



function App() {

  return (
    <>
       <Routes>
                <Route path="/" Component={Home} />
                <Route path="/profile" Component={UserProfile}/>
                <Route path="/lists" Component={Lists}/>
        </Routes>
    </>
  )
}

export default App
