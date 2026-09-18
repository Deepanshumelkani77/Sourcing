import React from 'react'
import assets from '../assets/assets'

const Header = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video 
        src={assets.video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={(e) => {
          // Fallback to a placeholder image if video doesn't exist
          e.target.style.display = 'none';
          const fallbackImg = document.createElement('img');
          fallbackImg.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
          fallbackImg.alt = 'Sourcing from China to Global Markets';
          fallbackImg.className = 'absolute top-0 left-0 w-full h-full object-cover';
          e.target.parentNode.appendChild(fallbackImg);
        }}
      />
    </section>
  )
}

export default Header
