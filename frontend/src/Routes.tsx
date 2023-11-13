import {  Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import UserProfile from './views/UserProfile'
import Lists from './views/Lists'

const Router: React.FC = () => {
    return (
        <Routes>
                <Route path="/" Component={Home} />
                <Route path="/" Component={UserProfile}/>
                <Route path="/" Component={Lists}/>
        </Routes>
    )
}

export default Router