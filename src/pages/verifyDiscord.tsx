import { useRouter } from "next/router";
import { useMemo } from "react";
import axios from "axios";
import Loader from "~/components/Common/Loader";

const verifyDiscord = () => {
  const router = useRouter();

  const fetchDiscordData = async (tokenType: string, accessToken: string) => {
    let discordName = "";
    try {
      const { data } = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      });

      const { username } = data;
      discordName = username
    } catch (e) {
      console.log(e);
    }

    localStorage.setItem("discordName", discordName);
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      close();
    }, 1000);
  }

  useMemo(
    () => {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const [tokenType, accessToken] = [fragment.get('access_token'), fragment.get('token_type')];
      if (!accessToken || !tokenType) {
        return false;
      }
      fetchDiscordData(accessToken, tokenType)

      return true;
    }, [router.asPath]
  );

  return (
    <Loader />
  )
}

export default verifyDiscord