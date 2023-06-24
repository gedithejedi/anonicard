import React, { useEffect } from 'react'

const discord = () => {



  return (
    <>
      <div>discord</div>
      <div className="flex items-center justify-center h-screen bg-discord-gray text-black" >
        <a
          className="bg-white text-xl px-5 py-3 rounded-md font-bold flex items-center space-x-4 hover:bg-gray-600 transition duration-75"
          target='_blank'
          href='https://discord.com/api/oauth2/authorize?client_id=1122030353213837362&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fdiscord&response_type=code&scope=identify'>
          Log in with Discord
        </a>
      </div>
    </>
  )
}

export default discord