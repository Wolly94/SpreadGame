import { PropUtils } from "./definitions";
export interface InfectCellProps {
    type: "InfectCell";
    infectedBy: Set<number>;
}
export declare const infectCellUtils: PropUtils<InfectCellProps>;
