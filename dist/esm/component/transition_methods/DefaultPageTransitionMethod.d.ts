import PageTransitionMethod, { PageTransitionData } from "../PageTransitionMethod";
export default class DefaultPageTransitionMethod extends PageTransitionMethod {
    PAGER_MEMORY_SCROLL_AMOUNT: number;
    position(data: PageTransitionData, pageIndex: number): string;
    scroll(data: PageTransitionData, value: number): number;
    translate(data: PageTransitionData, value: number, pageIndex: number): string;
    opacity(data: PageTransitionData, value: number, pageIndex: number): number;
    scale(data: PageTransitionData, value: number, pageIndex: number): number;
}
