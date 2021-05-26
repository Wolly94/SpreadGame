import { GeneralPerk, SkilledPerks } from "../skilltree/skilltree";

interface Player {
  id: number;
  skills: SkilledPerks[];
}

export default Player;
