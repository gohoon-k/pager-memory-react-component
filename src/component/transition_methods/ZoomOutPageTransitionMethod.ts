import PageTransitionMethod, {PageTransitionData} from "../PageTransitionMethod";
import {AbsoluteDimension} from "../PagerMemory";

export default class ZoomOutPageTransitionMethod extends PageTransitionMethod {

    position(data: PageTransitionData, pageIndex: number) {
        return (pageIndex * 100) + "%";
    }

    scroll(data: PageTransitionData, value: number) {
        let positionIndex: keyof AbsoluteDimension = (data.orientation === "vertical") ? "height" : "width";
        let floatArea = value - Math.floor(value);
        if (data.overscroll && value < 1) {
            return data.dimension[positionIndex] * (Math.floor(value) + (9 / 10 + floatArea / 10));
        } else if (data.overscroll && value > data.pageLength) {
            return data.dimension[positionIndex] * (Math.floor(value) + 1 / 10 * floatArea);
        } else {
            return data.dimension[positionIndex] * (Math.floor(value) +
                ((floatArea >= 0.5) ? ((-8) * Math.pow(floatArea - 1, 4) + 1) : 8 * Math.pow(floatArea, 4)));
        }
    }

    translate(data: PageTransitionData, value: number, pageIndex: number) {
        return "0%";
    }

    opacity(data: PageTransitionData, value: number, pageIndex: number) {
        let floatArea = value - Math.floor(value);

        let validPageMin = ((data.overscroll) ? 1 : 0);
        let validPageMax = ((data.overscroll) ? data.pageLength : data.pageLength - 1);

        if (value >= validPageMin && value <= validPageMax) {
            if (floatArea < 0.3) {
                return 1 - floatArea * 1.5;
            } else if (floatArea < 0.7) {
                return 0.55;
            } else {
                return 0.55 + (floatArea - 0.7) * 1.5;
            }
        } else if (value < validPageMin) {
            return 0.55 + (floatArea - 0.7) * 1.5;
        } else if (value > validPageMax) {
            return 1 - floatArea * 1.5;
        } else {
            // NOT HAPPENED
            return 0;
        }
    }

    scale(data: PageTransitionData, value: number, pageIndex: number) {
        let floatArea = value - Math.floor(value);
        if (floatArea < 0.2) {
            return 1 - floatArea / 4;
        } else if (floatArea < 0.8) {
            return 0.95;
        } else {
            return 0.95 + (floatArea - 0.8) / 4;
        }
    }
}