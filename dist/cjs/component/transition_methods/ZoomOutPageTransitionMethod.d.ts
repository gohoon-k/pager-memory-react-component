import PageTransitionMethod, { PageTransitionData } from "../PageTransitionMethod";
export default class ZoomOutPageTransitionMethod extends PageTransitionMethod {
    position(data: PageTransitionData, pageIndex: number): string;
    scroll(data: PageTransitionData, value: number): number;
    translate(data: PageTransitionData, value: number, pageIndex: number): string;
    opacity(data: PageTransitionData, value: number, pageIndex: number): number;
    scale(data: PageTransitionData, value: number, pageIndex: number): number;
}
