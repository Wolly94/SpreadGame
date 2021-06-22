import { SpreadGameImplementation } from "../../spreadGame";
import { ConquerCellEffect, ConquerCellEvent, ConquerCellProps } from "./conquerCell";
import { CreateBubbleEffect, CreateBubbleEvent } from "./createBubble";
import { DefendCellEffect, DefendCellEvent, DefendCellProps } from "./defendCell";
import { BeforeFightEffect, BeforeFightEvent, BubbleFightProps, CellFightProps } from "./fight";
import { GrowthEffect, GrowthEvent, GrowthProps } from "./growth";
import { InfectBubbleProps } from "./infectBubble";
import { InfectCellProps } from "./infectCell";
import { MoveEffect, MoveEvent, MoveProps } from "./move";
import { RaisableEvent, RaiseEventEffect, RaiseEventProps } from "./raiseEvent";
import { ReinforceCellEffect, ReinforceCellEvent } from "./reinforceCell";
import { SendUnitsEffect, SendUnitsEvent, SendUnitsProps } from "./sendUnits";
import { StartGameCellProps, StartGameEffect, StartGameEvent } from "./startGame";
import { StolenPerksProps } from "./stolenPerk";
import { TimeStepEffect, TimeStepEvent } from "./timeStep";
import { VisualizeBubbleProps } from "./visualizeBubbleProps";
import { VisualizeCellProps } from "./visualizeCellProps";
import { VisualizeGameProps } from "./visualizeGameProps";
export declare type PropUtils<TProps> = {
    combine: (a: TProps, b: TProps) => TProps;
    collect: (props: SpreadGameProps[]) => TProps;
    default: TProps;
};
export declare type NewSpreadGameEvent = TimeStepEvent | StartGameEvent | CreateBubbleEvent | SendUnitsEvent | ConquerCellEvent | DefendCellEvent | BeforeFightEvent | GrowthEvent | MoveEvent | RaisableEvent | ReinforceCellEvent;
export declare type SpreadGameProps = StartGameCellProps | ConquerCellProps | SendUnitsProps | BubbleFightProps | CellFightProps | DefendCellProps | VisualizeCellProps | VisualizeBubbleProps | VisualizeGameProps | GrowthProps | MoveProps | StolenPerksProps | InfectCellProps | InfectBubbleProps | RaiseEventProps;
export interface TimedProps<TProps> {
    expirationInMs: "Never" | number;
    value: TProps;
}
export interface Entity {
    type: "Game" | "Player" | "Bubble" | "Cell";
    id: number | null;
}
export interface AttachProps<TProps> {
    entity: Entity | null;
    perkName: string;
    triggerType: string;
    props: TProps;
}
export interface Effect<TEvent> {
    getValue: (trigger: TEvent, spreadGame: SpreadGameImplementation) => AttachProps<TimedProps<SpreadGameProps | RaiseEventProps>>[];
}
export declare type SpreadGameEffect = TimeStepEffect | StartGameEffect | ConquerCellEffect | SendUnitsEffect | CreateBubbleEffect | DefendCellEffect | BeforeFightEffect | GrowthEffect | MoveEffect | RaiseEventEffect | ReinforceCellEffect;
