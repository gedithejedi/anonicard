import { useState } from "react";

const discord = () => {
  const [discordName, setDiscordName] = useState("");

  window && window.addEventListener('storage', () => {
    const localStorageName = localStorage.getItem("discordName");
    console.log(localStorageName);
    if (localStorageName == null) {
      throw new Error("Something went wrong fetching localstorage discord username");
    }

    setDiscordName(localStorageName);
  })


  return (
    <>
      <div>discord</div>
      <div className="flex items-center justify-center h-screen bg-discord-gray text-white" >
        <a
          className="bg-discord text-xl px-5 py-3 rounded-md font-bold flex items-center space-x-4 hover:bg-gray-600 transition duration-75"
          target="_blank"
          href={process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_DISCORD_DEV : process.env.NEXT_PUBLIC_DISCORD_PROD}>
          Log in with Discord
        </a>
      </div>
      <div>
        {discordName && <span>The discord username is: {discordName}</span>}
      </div>
    </>
  )
}

export default discord