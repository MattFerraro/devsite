import WaveSurfer from 'wavesurfer.js'
import React, { useEffect, useState } from 'react'

const Waveformifier = (props) => {
  const [isComponentMounted, setIsComponentMounted] = useState(false)
  useEffect(async () => {

    document.querySelectorAll('.waveform-container').forEach((el) => {
      var wavesurfer = WaveSurfer.create({
        container: el,
        waveColor: 'violet',
        progressColor: 'purple',
        splitChannels: el.getAttribute("stereo") == "true",
      });
      wavesurfer.load(el.getAttribute("src"))

      wavesurfer.on("load", () => {
        console.log("loaded")
      })
      // wavesurfer.zoom(40)

      el.children[0].addEventListener("click", () => {
        wavesurfer.playPause()
      })

      el.children[1].addEventListener("click", () => {
        wavesurfer.zoom(10)
      })

      el.children[2].addEventListener("click", () => {
        wavesurfer.zoom(1000)
      })
      
      el.children[3].addEventListener("click", () => {
        wavesurfer.zoom(9000)
      })
    })
    
  })
  if(!isComponentMounted) {
    return null
  }
  return <div></div>
}

export default Waveformifier