import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDiscordAccountStore } from "~/store/discord";
import Loader from "~/components/Common/Loader";

const verifyDiscord = () => {
  const router = useRouter();
  const { fetchDiscordAccount } = useDiscordAccountStore();
  const { discordName } = useDiscordAccountStore((state) => state.state);

  useMemo(
    () => {
      console.log("sorage initialised");
      localStorage.setItem("discordName", discordName);
      console.log("event triggered");
      window.dispatchEvent(new Event("storage"));
      setTimeout(() => {
        close();
      }, 2000);
    }, [discordName]
  );

  const discordAccount = useMemo(
    () => {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const [tokenType, accessToken] = [fragment.get('access_token'), fragment.get('token_type')];
      if (!accessToken || !tokenType) {
        return false;
      }
      fetchDiscordAccount(accessToken, tokenType)

      return true;
    }, [router.asPath]
  );

  return (
    <Loader />
  )
}

export default verifyDiscord