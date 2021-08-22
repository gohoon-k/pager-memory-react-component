var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
// Wow!! So spaghetti!! So delicious!!!
import React, { useEffect, useCallback, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import DefaultPageTransitionMethod from "./transition_methods/DefaultPageTransitionMethod";
/** Creates Pager.
 *
 *  'Memory' is.. recommended github repository name. It does not mean anything... maybe.
 *  @author Gohoon-K
 *  @see PagerProps
 */
var PagerMemory = function (props) {
    var _a, _b, _c, _d, _e, _f;
    var element = useRef(null);
    var data = useRef({
        animating: false,
        animator: null,
        pointer: { enabled: false, start: { x: 0, y: 0 } },
        selected: -1
    });
    var _g = useState({ width: 0, height: 0 }), absoluteDimension = _g[0], setAbsoluteDimension = _g[1];
    var _h = useState({
        value: -1,
        vertical: false,
        horizontal: false,
        fixed: false
    }), scrolling = _h[0], setScrolling = _h[1];
    var pageLength = useMemo(function () { return React.Children.count(props.children); }, [props.children]);
    var childLength = useMemo(function () { return props.overscroll ? pageLength + 2 : pageLength; }, [pageLength, props.overscroll]);
    var index2position = useCallback(function (index) {
        return index - (props.overscroll ? 1 : 0);
    }, [props.overscroll]);
    var position2index = useCallback(function (position) {
        return position + (props.overscroll ? 1 : 0);
    }, [props.overscroll]);
    var transitionData = useMemo(function () {
        return {
            orientation: props.orientation,
            dimension: absoluteDimension,
            pageLength: pageLength,
            overscroll: props.overscroll === true
        };
    }, [absoluteDimension, pageLength, props.overscroll, props.orientation]);
    var pageStyles = useMemo(function () {
        if (pageLength === 0)
            return [];
        var styles = [];
        var vertical = props.orientation === "vertical";
        for (var pageIndex = 0; pageIndex < (props.overscroll ? childLength : pageLength); pageIndex++) {
            styles[pageIndex] = {
                left: vertical ? "unset" : "" + props.transitionMethod.position(transitionData, pageIndex),
                top: vertical ?
                    "calc(" + pageIndex * -100 + "% + " + props.transitionMethod.position(transitionData, pageIndex) + ")" :
                    pageIndex * -100 + "%",
                transform: "translate" + (vertical ? "Y" : "X") + "(" + props.transitionMethod.translate(transitionData, scrolling.value, pageIndex) + ") " +
                    ("scale(" + props.transitionMethod.scale(transitionData, scrolling.value, pageIndex) + ")"),
                opacity: props.transitionMethod.opacity(transitionData, scrolling.value, pageIndex),
                pointerEvents: pageIndex === data.current.selected ? "all" : "none",
                zIndex: childLength - pageIndex
            };
        }
        return styles;
    }, [pageLength, props.overscroll, props.orientation, props.transitionMethod, childLength, transitionData, scrolling.value, data]);
    var scrollIt = useCallback(function (value, newScroll) {
        if (!element.current)
            return;
        if (props.lockPager)
            return;
        if (value < 0 || value > childLength - 1)
            return;
        if (props.orientation !== "vertical" && scrolling.vertical)
            return;
        if (props.orientation === "vertical" && scrolling.horizontal)
            return;
        setScrolling(newScroll);
    }, [props.lockPager, props.orientation, childLength, scrolling.vertical, scrolling.horizontal]);
    var animateIt = useCallback(function (index) {
        if (props.lockPager)
            return;
        if (data.current.animating)
            return;
        var hasPageChanged = data.current.selected !== index;
        data.current.animating = true;
        data.current.selected = index;
        animateValue(data.current, scrolling.value, index, 200, function (animatedValue) { return scrollIt(animatedValue, __assign(__assign({}, scrolling), { value: animatedValue })); }, function () {
            var _a, _b;
            data.current.animating = false;
            if (hasPageChanged)
                (_b = (_a = props.listeners) === null || _a === void 0 ? void 0 : _a.select) === null || _b === void 0 ? void 0 : _b.forEach(function (selectListener) { return selectListener.call(null, index2position(data.current.selected)); });
        });
    }, [data, index2position, (_a = props.listeners) === null || _a === void 0 ? void 0 : _a.select, props.lockPager, scrollIt, scrolling]);
    var select = useCallback(function (position, animate) {
        var _a, _b;
        if (props.lockPager)
            return;
        if (position < 0 || position > pageLength - 1)
            return;
        var index = position2index(position);
        if (animate) {
            animateIt(index);
        }
        else {
            if (data.current.selected !== index)
                (_b = (_a = props.listeners) === null || _a === void 0 ? void 0 : _a.select) === null || _b === void 0 ? void 0 : _b.forEach(function (selectListener) { return selectListener.call(null, position); });
            data.current.selected = index;
            scrollIt(index, __assign(__assign({}, scrolling), { value: index }));
        }
    }, [animateIt, data, pageLength, position2index, (_b = props.listeners) === null || _b === void 0 ? void 0 : _b.select, props.lockPager, scrollIt, scrolling]);
    var next = useCallback(function (animate) {
        var _a, _b;
        (_b = (_a = props.controller) === null || _a === void 0 ? void 0 : _a.select) === null || _b === void 0 ? void 0 : _b.call(null, index2position(data.current.selected + 1), animate);
    }, [data, index2position, (_c = props.controller) === null || _c === void 0 ? void 0 : _c.select]);
    var previous = useCallback(function (animate) {
        var _a, _b;
        (_b = (_a = props.controller) === null || _a === void 0 ? void 0 : _a.select) === null || _b === void 0 ? void 0 : _b.call(null, index2position(data.current.selected - 1), animate);
    }, [data, index2position, (_d = props.controller) === null || _d === void 0 ? void 0 : _d.select]);
    var down = useCallback(function (x, y) {
        var _a, _b;
        if (data.current.animating && data.current.animator) {
            window.clearTimeout(data.current.animator);
            scrollIt(data.current.selected, __assign(__assign({}, scrolling), { value: data.current.selected }));
            data.current.animating = false;
            (_b = (_a = props.listeners) === null || _a === void 0 ? void 0 : _a.select) === null || _b === void 0 ? void 0 : _b.forEach(function (selectListener) { return selectListener.call(null, index2position(data.current.selected)); });
        }
        data.current.pointer = { enabled: true, start: { x: x, y: y } };
    }, [data, index2position, (_e = props.listeners) === null || _e === void 0 ? void 0 : _e.select, scrollIt, scrolling]);
    var move = useCallback(function (x, y) {
        var _a, _b;
        if (data.current.animating || !data.current.pointer.enabled)
            return;
        var size = absoluteDimension[(props.orientation === "vertical") ? "height" : "width"];
        var delta = data.current.pointer.start[(props.orientation === "vertical") ? "y" : "x"] - ((props.orientation === "vertical") ? y : x);
        var value = data.current.selected + (1 / size * delta);
        var newScrolling = {
            value: value,
            vertical: scrolling.vertical,
            horizontal: scrolling.horizontal,
            fixed: scrolling.fixed
        };
        if (!scrolling.fixed) {
            var vertical = Math.abs(x - data.current.pointer.start.x) < Math.abs(y - data.current.pointer.start.y);
            newScrolling = __assign(__assign({}, newScrolling), { vertical: vertical, horizontal: !vertical, fixed: (Math.abs(x - data.current.pointer.start.x) > 10 || Math.abs(y - data.current.pointer.start.y) > 10) });
        }
        (_b = (_a = props.listeners) === null || _a === void 0 ? void 0 : _a.scroll) === null || _b === void 0 ? void 0 : _b.forEach(function (scrollListener) { return scrollListener.call(null, value); });
        scrollIt(value, newScrolling);
    }, [absoluteDimension, data, (_f = props.listeners) === null || _f === void 0 ? void 0 : _f.scroll, props.orientation, scrollIt, scrolling]);
    var up = useCallback(function () {
        if (data.current.animating || !data.current.pointer.enabled)
            return;
        var index = data.current.selected;
        var AMOUNT = index - scrolling.value;
        if (AMOUNT > 0.2 && index !== position2index(0)) {
            animateIt(index - 1);
        }
        else if (AMOUNT < -0.2 && index !== position2index(pageLength) - 1) {
            animateIt(index + 1);
        }
        else {
            animateIt(index);
        }
        data.current.pointer = { enabled: false, start: { x: 0, y: 0 } };
        setScrolling({ value: scrolling.value, vertical: false, horizontal: false, fixed: false });
    }, [animateIt, data, pageLength, position2index, scrolling.value]);
    useEffect(function () {
        setAbsoluteDimension(getAbsoluteDimension(element.current));
    }, []);
    useEffect(function () {
        var resize = function () {
            setAbsoluteDimension(getAbsoluteDimension(element.current));
        };
        window.addEventListener("resize", resize);
        return function () { return window.removeEventListener("resize", resize); };
    }, []);
    useEffect(function () {
        if (!props.pointerEvents)
            return;
        var currentElement = element.current;
        if (!currentElement)
            return;
        var mouseDown = function (event) { return down.call(null, event.pageX, event.pageY); };
        var mouseMove = function (event) { return move.call(null, event.pageX, event.pageY); };
        var touchStart = function (event) { return down.call(null, event.touches[0].clientX, event.touches[0].clientY); };
        var touchMove = function (event) { return move.call(null, event.touches[0].clientX, event.touches[0].clientY); };
        currentElement.addEventListener("mousedown", mouseDown);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", up);
        currentElement.addEventListener("touchstart", touchStart);
        window.addEventListener("touchmove", touchMove);
        window.addEventListener("touchend", up);
        window.addEventListener("touchcancel", up);
        return function () {
            currentElement.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseup", up);
            currentElement.removeEventListener("touchstart", touchStart);
            window.removeEventListener("touchmove", touchMove);
            window.removeEventListener("touchend", up);
            window.removeEventListener("touchcancel", up);
        };
    }, [props.pointerEvents, down, move, up]);
    useEffect(function () {
        if (!props.controller)
            return;
        props.controller.select = select;
        props.controller.next = next;
        props.controller.previous = previous;
    }, [props.controller, select, next, previous]);
    useEffect(function () {
        if (!element.current)
            return;
        element.current.style.opacity = "1";
        if (props.orientation === "vertical") {
            element.current.scrollTop = props.transitionMethod.scroll(transitionData, scrolling.value);
        }
        else {
            element.current.scrollLeft = props.transitionMethod.scroll(transitionData, scrolling.value);
        }
    }, [element, props.orientation, scrolling, props.transitionMethod, transitionData]);
    useEffect(function () {
        var isFirstRender = data.current.selected === -1;
        var getNewValue = function (prev) { return !isFirstRender ? (props.overscroll ? prev.value + 1 : prev.value - 1) : position2index(0); };
        setScrolling(function (prev) {
            var newValue = getNewValue(prev);
            data.current.selected = newValue;
            return __assign(__assign({}, prev), { value: newValue });
        });
    }, [data, position2index, props.overscroll]);
    useEffect(function () {
        if (data.current.selected > position2index(pageLength - 1)) {
            setScrolling(function (prev) {
                data.current.selected = position2index(pageLength - 1);
                return __assign(__assign({}, prev), { value: position2index(pageLength - 1) });
            });
        }
    }, [data, data.current.selected, position2index, pageLength]);
    if (pageLength === 0)
        return _jsx(PagerElement, { ref: element, style: { display: "none" } }, void 0);
    if (absoluteDimension.width === 0 || absoluteDimension.height === 0) {
        return _jsx(PagerElement, { ref: element, style: { width: props.dimension.width, height: props.dimension.height } }, void 0);
    }
    var renderTargets = [];
    if (props.overscroll)
        renderTargets.push(_jsx(PagerItem, { style: __assign({}, pageStyles[0]) }, "PagerMemory_OverscrollDummy_Start"));
    renderTargets.push.apply(renderTargets, (React.Children.map(props.children, function (page, position) {
        return _jsx(PagerItem, __assign({ style: __assign({}, pageStyles[position2index(position)]) }, { children: page }), "PagerMemory_Page_" + position);
    })));
    if (props.overscroll)
        renderTargets.push(_jsx(PagerItem, { style: __assign({}, pageStyles[pageLength + 1]) }, "PagerMemory_OverscrollDummy_End"));
    return _jsx(PagerElement, __assign({ ref: element, style: { width: props.dimension.width, height: props.dimension.height } }, { children: renderTargets }), void 0);
};
PagerMemory.defaultProps = {
    transitionMethod: new DefaultPageTransitionMethod(),
    pointerEvents: true
};
var PagerElement = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: hidden;\n  user-select: none;\n  opacity: 0;\n"], ["\n  overflow: hidden;\n  user-select: none;\n  opacity: 0;\n"])));
var PagerItem = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  margin: 0;\n  overflow: auto;\n"], ["\n  position: relative;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  margin: 0;\n  overflow: auto;\n"
    /** Holds absolute dimension in pixels of pager.
     *  @param {number} width width of dimension.
     *  @param {number} height height of dimension.
     */
])));
/** Animates value.
 *  Animator will passed to [data.timeout]{@link PagerData.animator}, so use it to stop animation manually. */
var animateValue = function (data, from, to, duration, step, finish) {
    if (from === to) {
        finish();
        return;
    }
    var progress = 0;
    var animatedValue = from;
    var DELTA = Math.abs(to - from);
    var DIRECTION = (to - from > 0) ? 1 : -1;
    var STEP_LENGTH_MS = 10;
    var STEP_LENGTH = DELTA / (duration / STEP_LENGTH_MS);
    var animate = function () {
        if (duration <= progress * STEP_LENGTH_MS) {
            step(to);
            finish();
            return;
        }
        animatedValue = from + DIRECTION * STEP_LENGTH * progress;
        step(animatedValue);
        progress++;
        data.animator = window.setTimeout(animate, STEP_LENGTH_MS);
    };
    animate();
};
/** Calculates element's absolute dimension. */
var getAbsoluteDimension = function (element) {
    if (!element)
        return { width: 0, height: 0 };
    var rect = element.getBoundingClientRect();
    if (rect.width !== 0 && rect.height !== 0) {
        return { width: rect.width, height: rect.height };
    }
    else {
        return { width: rect.right - rect.left, height: rect.bottom - rect.top };
    }
};
/** Generates default [PagerController]{@link PagerController} object.
 *  Must be used after first render. */
export var generatePagerController = function () {
    return {
        select: function () {
        },
        next: function () {
        },
        previous: function () {
        }
    };
};
export default PagerMemory;
var templateObject_1, templateObject_2;
