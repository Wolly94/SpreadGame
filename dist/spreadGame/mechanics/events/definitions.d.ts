import { SpreadMap } from "../../map/map";
import { SpreadGameImplementation } from "../../spreadGame";
import { ConquerCellEffect, ConquerCellEvent, ConquerCellProps } from "./conquerCell";
import { CreateBubbleEffect, CreateBubbleEvent } from "./createBubble";
import { DefendCellEffect, DefendCellEvent, DefendCellProps } from "./defendCell";
import { BubbleFightProps, CellFightProps } from "./fight";
import { SendUnitsEffect, SendUnitsEvent, SendUnitsProps } from "./sendUnits";
export declare type PropUtils<TProps> = {
    combine: (a: TProps, b: TProps) => TProps;
    collect: (props: SpreadGameProps[]) => TProps;
    default: TProps;
};
export interface StartGameEvent {
    type: "StartGameEvent";
    map: SpreadMap;
}
export declare type NewSpreadGameEvent = StartGameEvent | CreateBubbleEvent | SendUnitsEvent | ConquerCellEvent | DefendCellEvent;
export declare type SpreadGameProps = ConquerCellProps | SendUnitsProps | BubbleFightProps | CellFightProps | DefendCellProps;
export interface TimedProps<TProps> {
    expirationInMs: "Never" | number;
    value: TProps;
}
export interface Entity {
    type: "Player" | "Bubble" | "Cell";
    id: "All" | number;
}
export interface AttachProps<TProps> {
    entity: Entity | null;
    perkName: string;
    props: TProps;
}
export interface Effect<TEvent> {
    getValue: (trigger: TEvent, spreadGame: SpreadGameImplementation) => AttachProps<TimedProps<SpreadGameProps>>;
}
export declare type SpreadGameEffect = ConquerCellEffect | SendUnitsEffect | CreateBubbleEffect | DefendCellEffect;
