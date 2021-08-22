import PageTransitionMethod, {PageTransitionData} from "../PageTransitionMethod";

export default class DefaultPageTransitionMethod extends PageTransitionMethod {

    PAGER_MEMORY_SCROLL_AMOUNT = 8;

    position(data: PageTransitionData, pageIndex: number): string {
        return (pageIndex * (100 / this.PAGER_MEMORY_SCROLL_AMOUNT)) + "%";
    }

    scroll(data: PageTransitionData, value: number): number {
        let scrollAmountPerPage = data.dimension[(data.orientation === "vertical") ? "height" : "width"] / this.PAGER_MEMORY_SCROLL_AMOUNT;
        let intValue = Math.floor(value);
        let floatArea = value - intValue;

        if (data.overscroll && value < 1) {
            return scrollAmountPerPage * (intValue + (3 / 4 + floatArea / 4));
        } else if (data.overscroll && value > data.pageLength) {
            return scrollAmountPerPage * (intValue + 1 / 4 * floatArea);
        } else {
            return scrollAmountPerPage * (intValue +
                ((floatArea >= 0.5) ? ((-128) * Math.pow(floatArea - 1, 8) + 1) : 128 * Math.pow(floatArea, 8)));
        }
    }

    translate(data: PageTransitionData, value: number, pageIndex: number): string {
        return "0%";
    }

    opacity(data: PageTransitionData, value: number, pageIndex: number): number {
        let validPageMin = ((data.overscroll) ? 1 : 0);
        let validPageMax = ((data.overscroll) ? data.pageLength : data.pageLength - 1);
        if (value >= validPageMin && value <= validPageMax) {
            return Math.max(-2 * Math.abs(value - pageIndex) + 1, 0);
        } else if (value < validPageMin) {
            return Math.max(-1 * pageIndex + 2, 0);
        } else if (value > validPageMax) {
            return Math.max(pageIndex - validPageMax + 1, 0);
        }
        return 0;
    }

    scale(data: PageTransitionData, value: number, pageIndex: number): number {
        return 1.0;
    }

}
