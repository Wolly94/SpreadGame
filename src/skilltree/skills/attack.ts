import { BaseAttackPerk } from "../../spreadGame/perks/baseAttack"
import { RagePerk } from "../../spreadGame/perks/rage"
import { Skill } from "../skilltree"

export const Attack: Skill = {
    name: "Attack",
    perks: [
        BaseAttackPerk.createFromValues(),
        RagePerk.createFromValues(),
        //Berserk,
        //Slavery,
    ],
};
