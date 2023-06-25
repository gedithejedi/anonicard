import axios from "axios";

export const fetchARandomNoun = async () => {
  const res = await axios.get("https://api.cloudnouns.com/v1/pfp?head=13&glasses=15");
  return res;
}