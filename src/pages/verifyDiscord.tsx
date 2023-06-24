import { useRouter } from "next/router";
import { useMemo } from "react";

const verifyDiscord = () => {
  const router = useRouter();

  const discordAccount = useMemo(
    () => {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];
      if (!accessToken) {
        return false;
      }

      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      })
        .then(result => result.json())
        .then(response => {
          const { username, discriminator } = response;
          console.log(username);
          console.log(discriminator);
        })
        .catch(console.error);

      return true;
    }, [router.asPath]
  );

  return (
    <div>verifyDiscord</div>
  )
}

export default verifyDiscord