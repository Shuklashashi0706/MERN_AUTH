import React from 'react'
import {Router,Routes,Route} from "react-router-dom";
import Home from "./screens/home"
function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
  )
}

export default App