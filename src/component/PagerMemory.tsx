// Wow!! So spaghetti!! So delicious!!!

import React, {useEffect, useCallback, useRef, useState, useMemo} from "react";
import CSS from "csstype";

import styled from "styled-components";

import PageTransitionMethod, {PageTransitionData} from "./PageTransitionMethod";
import DefaultPageTransitionMethod from "./transition_methods/DefaultPageTransitionMethod";


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
type PagerProps = {
    /** Dimension of this pager. Must include units, like: 50% or 150px, etc.
     *  @see Dimension */
    dimension: Dimension
    /** Orientation of this pager.
     *  @see PagerOrientation */
    orientation: PagerOrientation

    /** PagerController object. Use generatePagerController() function to initialize PagerController.
     *  @see PagerController */
    controller?: PagerController
    /** Optional. Use this prop if you want to do something when selected page is changed or user scrolls pager. */
    listeners?: {
        select?: ((position: number) => void)[]
        scroll?: ((value: number) => void)[]
    },
    /** Optional. If this prop is true, this pager will be locked and cannot change its selected page. */
    lockPager?: boolean
    /** Optional. If this prop is true, pager can overscroll. */
    overscroll?: boolean
    /** Optional. If this props is true, user can change pager's selected page by swiping pager. */
    pointerEvents?: boolean
    /** Optional. Use this prop to customize page transition effect.
     *  @see PageTransitionMethod */
    transitionMethod?: PageTransitionMethod
}

/** Creates Pager.
 *
 *  'Memory' is.. recommended github repository name. It does not mean anything... maybe.
 *  @author Gohoon-K
 *  @see PagerProps
 */
const PagerMemory: React.FC<PagerProps> = (props) => {

    const element = useRef<HTMLDivElement>(null);

    const data = useRef<PagerData>({
        animating: false,
        animator: null,
        pointer: {enabled: false, start: {x: 0, y: 0}},
        selected: -1
    });

    const [absoluteDimension, setAbsoluteDimension] = useState<AbsoluteDimension>({width: 0, height: 0});
    const [scrolling, setScrolling] = useState<ScrollingData>({
        value: -1,
        vertical: false,
        horizontal: false,
        fixed: false
    });

    const pageLength = useMemo(() => React.Children.count(props.children), [props.children]);
    const childLength = useMemo(() => props.overscroll ? pageLength + 2 : pageLength, [pageLength, props.overscroll]);

    const index2position = useCallback((index: number) => {
        return index - (props.overscroll ? 1 : 0);
    }, [props.overscroll]);
    const position2index = useCallback((position: number) => {
        return position + (props.overscroll ? 1 : 0);
    }, [props.overscroll]);

    const transitionData: PageTransitionData = useMemo(() => {
        return {
            orientation: props.orientation,
            dimension: absoluteDimension,
            pageLength: pageLength,
            overscroll: props.overscroll === true
        };
    }, [absoluteDimension, pageLength, props.overscroll, props.orientation]);

    const pageStyles: CSS.Properties[] = useMemo(() => {
        if (pageLength === 0) return [];

        const styles: CSS.Properties[] = [];
        const vertical = props.orientation === "vertical";
        for (let pageIndex = 0; pageIndex < (props.overscroll ? childLength : pageLength); pageIndex++) {
            styles[pageIndex] = {
                left: vertical ? "unset" : `${props.transitionMethod!!.position(transitionData, pageIndex)}`,
                top: vertical ?
                    `calc(${pageIndex * -100}% + ${props.transitionMethod!!.position(transitionData, pageIndex)})` :
                    `${pageIndex * -100}%`,
                transform: `translate${vertical ? "Y" : "X"}(${props.transitionMethod!!.translate(transitionData, scrolling.value, pageIndex)}) ` +
                    `scale(${props.transitionMethod!!.scale(transitionData, scrolling.value, pageIndex)})`,
                opacity: props.transitionMethod!!.opacity(transitionData, scrolling.value, pageIndex),
                pointerEvents: pageIndex === data.current.selected ? "all" : "none",
                zIndex: childLength - pageIndex
            };
        }

        return styles;
    }, [pageLength, props.overscroll, props.orientation, props.transitionMethod, childLength, transitionData, scrolling.value, data]);

    const scrollIt = useCallback((value: number, newScroll: ScrollingData) => {
        if (!element.current) return;
        if (props.lockPager) return;

        if (value < 0 || value > childLength - 1) return;

        if (props.orientation !== "vertical" && scrolling.vertical) return;
        if (props.orientation === "vertical" && scrolling.horizontal) return;

        setScrolling(newScroll);
    }, [props.lockPager, props.orientation, childLength, scrolling.vertical, scrolling.horizontal]);

    const animateIt = useCallback((index: number) => {
        if (props.lockPager) return;
        if (data.current.animating) return;

        const hasPageChanged = data.current.selected !== index;

        data.current.animating = true;
        data.current.selected = index;
        animateValue(data.current, scrolling.value, index, 200,
            (animatedValue: number) => scrollIt(animatedValue, {...scrolling, value: animatedValue}),
            () => {
                data.current.animating = false
                if (hasPageChanged)
                    props.listeners?.select?.forEach((selectListener) => selectListener.call(null, index2position(data.current.selected)));
            }
        );
    }, [data, index2position, props.listeners?.select, props.lockPager, scrollIt, scrolling]);

    const select = useCallback((position: number, animate: boolean) => {
        if (props.lockPager) return;
        if (position < 0 || position > pageLength - 1) return;

        let index = position2index(position);

        if (animate) {
            animateIt(index);
        } else {
            if (data.current.selected !== index)
                props.listeners?.select?.forEach((selectListener) => selectListener.call(null, position));

            data.current.selected = index;
            scrollIt(index, {...scrolling, value: index});
        }
    }, [animateIt, data, pageLength, position2index, props.listeners?.select, props.lockPager, scrollIt, scrolling]);

    const next = useCallback((animate: boolean) => {
        props.controller?.select?.call(null, index2position(data.current.selected + 1), animate);
    }, [data, index2position, props.controller?.select]);

    const previous = useCallback((animate: boolean) => {
        props.controller?.select?.call(null, index2position(data.current.selected - 1), animate);
    }, [data, index2position, props.controller?.select]);

    const down = useCallback((x: number, y: number) => {
        if (data.current.animating && data.current.animator) {
            window.clearTimeout(data.current.animator);
            scrollIt(data.current.selected, {...scrolling, value: data.current.selected});
            data.current.animating = false;
            props.listeners?.select?.forEach((selectListener) => selectListener.call(null, index2position(data.current.selected)));
        }

        data.current.pointer = {enabled: true, start: {x: x, y: y}};
    }, [data, index2position, props.listeners?.select, scrollIt, scrolling]);

    const move = useCallback((x: number, y: number) => {
        if (data.current.animating || !data.current.pointer.enabled) return;

        const size = absoluteDimension[(props.orientation === "vertical") ? "height" : "width"];
        const delta = data.current.pointer.start[(props.orientation === "vertical") ? "y" : "x"] - ((props.orientation === "vertical") ? y : x);

        const value = data.current.selected + (1 / size * delta);

        let newScrolling: ScrollingData = {
            value: value,
            vertical: scrolling.vertical,
            horizontal: scrolling.horizontal,
            fixed: scrolling.fixed
        };
        if (!scrolling.fixed) {
            let vertical = Math.abs(x - data.current.pointer.start.x) < Math.abs(y - data.current.pointer.start.y);
            newScrolling = {
                ...newScrolling,
                vertical: vertical,
                horizontal: !vertical,
                fixed: (Math.abs(x - data.current.pointer.start.x) > 10 || Math.abs(y - data.current.pointer.start.y) > 10)
            }
        }

        props.listeners?.scroll?.forEach((scrollListener) => scrollListener.call(null, value));

        scrollIt(value, newScrolling);
    }, [absoluteDimension, data, props.listeners?.scroll, props.orientation, scrollIt, scrolling]);

    const up = useCallback(() => {
        if (data.current.animating || !data.current.pointer.enabled) return;

        const index = data.current.selected;
        const AMOUNT = index - scrolling.value;
        if (AMOUNT > 0.2 && index !== position2index(0)) {
            animateIt(index - 1);
        } else if (AMOUNT < -0.2 && index !== position2index(pageLength) - 1) {
            animateIt(index + 1);
        } else {
            animateIt(index);
        }

        data.current.pointer = {enabled: false, start: {x: 0, y: 0}};
        setScrolling({value: scrolling.value, vertical: false, horizontal: false, fixed: false});
    }, [animateIt, data, pageLength, position2index, scrolling.value]);

    useEffect(() => {
        setAbsoluteDimension(getAbsoluteDimension(element.current));
    }, []);

    useEffect(() => {
        const resize = () => {
            setAbsoluteDimension(getAbsoluteDimension(element.current));
        };
        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        if (!props.pointerEvents) return;

        const currentElement = element.current;
        if (!currentElement) return;

        const mouseDown = (event: MouseEvent) => down.call(null, event.pageX, event.pageY);
        const mouseMove = (event: MouseEvent) => move.call(null, event.pageX, event.pageY);

        const touchStart = (event: TouchEvent) => down.call(null, event.touches[0].clientX, event.touches[0].clientY);
        const touchMove = (event: TouchEvent) => move.call(null, event.touches[0].clientX, event.touches[0].clientY);

        currentElement.addEventListener("mousedown", mouseDown);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", up);

        currentElement.addEventListener("touchstart", touchStart);
        window.addEventListener("touchmove", touchMove);
        window.addEventListener("touchend", up);
        window.addEventListener("touchcancel", up);

        return () => {
            currentElement.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", up);

            currentElement.removeEventListener("touchstart", touchStart);
            window.removeEventListener("touchmove", touchMove);
            window.removeEventListener("touchend", up);
            window.removeEventListener("touchcancel", up);
        }
    }, [props.pointerEvents, down, move, up]);

    useEffect(() => {
        if (!props.controller) return;

        props.controller.select = select;
        props.controller.next = next;
        props.controller.previous = previous;
    }, [props.controller, select, next, previous]);

    useEffect(() => {
        if (!element.current) return;

        element.current.style.opacity = "1";

        if (props.orientation === "vertical") {
            element.current.scrollTop = props.transitionMethod!!.scroll(transitionData, scrolling.value);
        } else {
            element.current.scrollLeft = props.transitionMethod!!.scroll(transitionData, scrolling.value);
        }
    }, [element, props.orientation, scrolling, props.transitionMethod, transitionData]);

    useEffect(() => {
        const isFirstRender = data.current.selected === -1;
        const getNewValue = (prev: ScrollingData) => !isFirstRender ? (props.overscroll ? prev.value + 1 : prev.value - 1) : position2index(0);

        setScrolling((prev) => {
            const newValue = getNewValue(prev);
            data.current.selected = newValue;
            return {...prev, value: newValue};
        });
    }, [data, position2index, props.overscroll]);

    useEffect(() => {
        if (data.current.selected > position2index(pageLength - 1)) {
            setScrolling((prev) => {
                data.current.selected = position2index(pageLength - 1);
                return {...prev, value: position2index(pageLength - 1)};
            });
        }
    }, [data, data.current.selected, position2index, pageLength]);

    if (pageLength === 0)
        return <PagerElement ref={element} style={{display: "none"}}/>;

    if (absoluteDimension.width === 0 || absoluteDimension.height === 0) {
        return <PagerElement ref={element} style={{width: props.dimension.width, height: props.dimension.height}}/>;
    }

    const renderTargets = [];

    if (props.overscroll)
        renderTargets.push(<PagerItem key={`PagerMemory_OverscrollDummy_Start`}
                                      style={{...pageStyles[0]}}/>);

    renderTargets.push(...(React.Children.map(props.children, (page, position) =>
        <PagerItem key={`PagerMemory_Page_${position}`}
                   style={{...pageStyles[position2index(position)]}}>{page}</PagerItem>)!!));

    if (props.overscroll)
        renderTargets.push(<PagerItem key={`PagerMemory_OverscrollDummy_End`}
                                      style={{...pageStyles[pageLength + 1]}}/>);

    return <PagerElement ref={element} style={{width: props.dimension.width, height: props.dimension.height}}>
        {renderTargets}
    </PagerElement>;
}

PagerMemory.defaultProps = {
    transitionMethod: new DefaultPageTransitionMethod(),
    pointerEvents: true
};

const PagerElement = styled.div`
  overflow: hidden;
  user-select: none;
  opacity: 0;
`

const PagerItem = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: auto;
`


/** Holds absolute dimension in pixels of pager.
 *  @param {number} width width of dimension.
 *  @param {number} height height of dimension.
 */
export type AbsoluteDimension = { width: number, height: number };

/** Holds dimension data with given units of pager.
 *  @param {string} width width of dimension.
 *  @param {string} height height of dimension.
 */
type Dimension = { width: CSS.Property.Width, height: CSS.Property.Height };

/** Type of pager. */
export type PagerOrientation = "vertical" | "horizontal";

/**
 *  @type PagerController
 *  Includes pager control functions:
 *      [select]{@link PagerController.select},
 *      [next]{@link PagerController.next},
 *      [previous]{@link PagerController.previous}.
 */
type PagerController = {
    /** Selects given page. */
    select: (target: number, animate: boolean) => void
    /** Selects next page of current selected page. */
    next: (animate: boolean) => void
    /** Selects previous page of current selected page. */
    previous: (animate: boolean) => void
}

/** Holds Coordination data */
type Coordination = { x: number, y: number };

/** Holds Pager flags */
type PagerData = {
    /** true if pager is animating page animation, false otherwise */
    animating: boolean
    /** timeout object used in [animateValue]{@link animateValue} function */
    animator: number | null
    /** [input data]{@link PointerData} of pager. */
    pointer: PointerData
    /** selected page index. includes overscroll dummy page. */
    selected: number
};

/** Holds pointer data */
type PointerData = {
    /** true if pointer is down to screen */
    enabled: boolean
    /** holds start position of pointer (assigned when down) */
    start: Coordination
}

/** Holds pager scrolling data */
type ScrollingData = {
    /** scroll value. float value in [0, childLength] range. */
    value: number
    /** true if user scrolls in vertical direction. */
    vertical: boolean
    /** true if user scrolls in horizontal direction. */
    horizontal: boolean
    /** true if user scrolls in one direction enough, so that we don't have to calculate scroll direction anymore. */
    fixed: boolean
}

/** Animates value.
 *  Animator will passed to [data.timeout]{@link PagerData.animator}, so use it to stop animation manually. */
const animateValue = (data: PagerData, from: number, to: number, duration: number, step: (animatedValue: number) => void, finish: () => void) => {
    if (from === to) {
        finish();
        return;
    }
    let progress = 0;
    let animatedValue = from;
    let DELTA = Math.abs(to - from);
    let DIRECTION = (to - from > 0) ? 1 : -1;
    let STEP_LENGTH_MS = 10;
    let STEP_LENGTH = DELTA / (duration / STEP_LENGTH_MS);
    let animate = function () {
        if (duration <= progress * STEP_LENGTH_MS) {
            step(to);
            finish();
            return;
        }
        animatedValue = from + DIRECTION * STEP_LENGTH * progress;
        step(animatedValue);
        progress++;
        data.animator = window.setTimeout(animate, STEP_LENGTH_MS);
    }
    animate();
}

/** Calculates element's absolute dimension. */
const getAbsoluteDimension = (element: HTMLDivElement | null): AbsoluteDimension => {
    if (!element) return {width: 0, height: 0};

    let rect = element.getBoundingClientRect();
    if (rect.width !== 0 && rect.height !== 0) {
        return {width: rect.width, height: rect.height};
    } else {
        return {width: rect.right - rect.left, height: rect.bottom - rect.top};
    }
}

/** Generates default [PagerController]{@link PagerController} object.
 *  Must be used after first render. */
export const generatePagerController = (): PagerController => {
    return {
        select: () => {
        },
        next: () => {
        },
        previous: () => {
        }
    }
}

export default PagerMemory;
