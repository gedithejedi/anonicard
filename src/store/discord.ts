import axios from "axios";
import { produce } from "immer"
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


export interface DiscordAccount {
  discordName: string,
}

interface DiscordAccountStore {
  fetchDiscordAccount: (tokenType: string, accessToken: string) => Promise<void>;
  state: DiscordAccount;
}

const state = {
  discordName: "",
};

export const useDiscordAccountStore = create<DiscordAccountStore>()(
  immer((set, _get) => ({
    fetchDiscordAccount: async (tokenType: string, accessToken: string) => {
      if (!tokenType || !accessToken) {
        return;
      }

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

      if (discordName) {
        set(
          produce((draft) => {
            draft.state.discordName = discordName || state?.discordName;
          })
        );
      }
    },
    state
  }))
);