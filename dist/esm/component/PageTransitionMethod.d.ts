import { AbsoluteDimension, PagerOrientation } from "./PagerMemory";
/**
 *  @class PageTransitionMethod
 *  Defines Page transition effect of Pager.
 *
 *  Contains these functions:
 *
 *      [position]{@link PageTransitionMethod.position},
 *      [scroll]{@link PageTransitionMethod.scroll},
 *      [translate]{@link PageTransitionMethod.translate},
 *      [opacity]{@link PageTransitionMethod.opacity},
 *      [scale]{@link PageTransitionMethod.scale}
 *
 *  You can create extension class of this PageTransitionMethod class, and pass it to transitionMethod prop.
 */
export default abstract class PageTransitionMethod {
    /** Defines initial positions of each page elements. */
    abstract position(data: PageTransitionData, pageIndex: number): string;
    /** Defines Element.scroll* value of Pager's root element by scroll value([0, pageLength], float). */
    abstract scroll(data: PageTransitionData, value: number): number;
    /** Defines transform.translate style of each page elements by scroll value([0, pageLength], float). */
    abstract translate(data: PageTransitionData, value: number, pageIndex: number): string;
    /** Defines opacity style of each page elements by scroll value([0, pageLength], float).*/
    abstract opacity(data: PageTransitionData, value: number, pageIndex: number): number;
    /** Defines transform.scale style of each page elements by scroll value([0, pageLength], float). */
    abstract scale(data: PageTransitionData, value: number, pageIndex: number): number;
}
/** Holds some data used in extension class of [PageTransitionMethod]{@link PageTransitionMethod} class. */
export declare type PageTransitionData = {
    /** [PagerType]{@link PagerOrientation} of pager */
    orientation: PagerOrientation;
    /** [AbsoluteDimension]{@link AbsoluteDimension} of pager */
    dimension: AbsoluteDimension;
    /** [props.overscroll]{@link PagerProps.overscroll} of [PagerMemory]{@link PagerMemory} */
    overscroll: boolean;
    /** length of pager items. overscroll dummy are not included. */
    pageLength: number;
};
