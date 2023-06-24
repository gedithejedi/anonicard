import { useEffect, useState } from "react";
import { useDiscordAccountStore } from "~/store/discord";

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
  //TODO: implement urls for both local and deployed on vercel versions

  return (
    <>
      <div>discord</div>
      <div className="flex items-center justify-center h-screen bg-discord-gray text-white" >
        <a
          className="bg-black text-xl px-5 py-3 rounded-md font-bold flex items-center space-x-4 hover:bg-gray-600 transition duration-75"
          target="_blank"
          href='https://discord.com/api/oauth2/authorize?client_id=1122030353213837362&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FverifyDiscord&response_type=token&scope=identify'>
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