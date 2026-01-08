import React from 'react'

import imageTest from '../assets/retiremate.jpg'
const Test = () => {
  return (
    <div>
        <img onClick={()=> navigator.share() } src={imageTest} alt="meta-image" />
    </div>
  )
}

export default Test