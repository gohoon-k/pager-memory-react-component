import React from "react";
import CSS from "csstype";
import PageTransitionMethod from "./PageTransitionMethod";
/**
 *  Properties of [PagerMemory]{@link PagerMemory}.
 *
 *  Required:
 *      [dimension]{@link PagerProps.dimension},
 *      [orientation]{@link PagerProps.orientation}
 *
 *  Optional:
 *      [controller]{@link PagerProps.controller},
 *      [listeners]{@link PagerProps.listeners},
 *      [lockPager]{@link PagerProps.lockPager},
 *      [overscroll]{@link PagerProps.overscroll},
 *      [pointerEvents]{@link PagerProps.pointerEvents},
 *      [transitionMethod]{@link PagerProps.transitionMethod}
 */
declare type PagerProps = {
    /** Dimension of this pager. Must include units, like: 50% or 150px, etc.
     *  @see Dimension */
    dimension: Dimension;
    /** Orientation of this pager.
     *  @see PagerOrientation */
    orientation: PagerOrientation;
    /** PagerController object. Use generatePagerController() function to initialize PagerController.
     *  @see PagerController */
    controller?: PagerController;
    /** Optional. Use this prop if you want to do something when selected page is changed or user scrolls pager. */
    listeners?: {
        select?: ((position: number) => void)[];
        scroll?: ((value: number) => void)[];
    };
    /** Optional. If this prop is true, this pager will be locked and cannot change its selected page. */
    lockPager?: boolean;
    /** Optional. If this prop is true, pager can overscroll. */
    overscroll?: boolean;
    /** Optional. If this props is true, user can change pager's selected page by swiping pager. */
    pointerEvents?: boolean;
    /** Optional. Use this prop to customize page transition effect.
     *  @see PageTransitionMethod */
    transitionMethod?: PageTransitionMethod;
};
/** Creates Pager.
 *
 *  'Memory' is.. recommended github repository name. It does not mean anything... maybe.
 *  @author Gohoon-K
 *  @see PagerProps
 */
declare const PagerMemory: React.FC<PagerProps>;
/** Holds absolute dimension in pixels of pager.
 *  @param {number} width width of dimension.
 *  @param {number} height height of dimension.
 */
export declare type AbsoluteDimension = {
    width: number;
    height: number;
};
/** Holds dimension data with given units of pager.
 *  @param {string} width width of dimension.
 *  @param {string} height height of dimension.
 */
declare type Dimension = {
    width: CSS.Property.Width;
    height: CSS.Property.Height;
};
/** Type of pager. */
export declare type PagerOrientation = "vertical" | "horizontal";
/**
 *  @type PagerController
 *  Includes pager control functions:
 *      [select]{@link PagerController.select},
 *      [next]{@link PagerController.next},
 *      [previous]{@link PagerController.previous}.
 */
declare type PagerController = {
    /** Selects given page. */
    select: (target: number, animate: boolean) => void;
    /** Selects next page of current selected page. */
    next: (animate: boolean) => void;
    /** Selects previous page of current selected page. */
    previous: (animate: boolean) => void;
};
/** Generates default [PagerController]{@link PagerController} object.
 *  Must be used after first render. */
export declare const generatePagerController: () => PagerController;
export default PagerMemory;
