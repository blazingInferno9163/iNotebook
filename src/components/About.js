import React, { useEffect } from 'react'
import { useContext } from 'react'
import noteContext from '../context/notes/noteContext'

const About = () => {
  const a=useContext(noteContext)

  return (
    <div>
      About
      </div>
  )
}

export default About