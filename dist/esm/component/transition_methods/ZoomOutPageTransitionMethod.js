var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import PageTransitionMethod from "../PageTransitionMethod";
var ZoomOutPageTransitionMethod = /** @class */ (function (_super) {
    __extends(ZoomOutPageTransitionMethod, _super);
    function ZoomOutPageTransitionMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomOutPageTransitionMethod.prototype.position = function (data, pageIndex) {
        return (pageIndex * 100) + "%";
    };
    ZoomOutPageTransitionMethod.prototype.scroll = function (data, value) {
        var positionIndex = (data.orientation === "vertical") ? "height" : "width";
        var floatArea = value - Math.floor(value);
        if (data.overscroll && value < 1) {
            return data.dimension[positionIndex] * (Math.floor(value) + (9 / 10 + floatArea / 10));
        }
        else if (data.overscroll && value > data.pageLength) {
            return data.dimension[positionIndex] * (Math.floor(value) + 1 / 10 * floatArea);
        }
        else {
            return data.dimension[positionIndex] * (Math.floor(value) +
                ((floatArea >= 0.5) ? ((-8) * Math.pow(floatArea - 1, 4) + 1) : 8 * Math.pow(floatArea, 4)));
        }
    };
    ZoomOutPageTransitionMethod.prototype.translate = function (data, value, pageIndex) {
        return "0%";
    };
    ZoomOutPageTransitionMethod.prototype.opacity = function (data, value, pageIndex) {
        var floatArea = value - Math.floor(value);
        var validPageMin = ((data.overscroll) ? 1 : 0);
        var validPageMax = ((data.overscroll) ? data.pageLength : data.pageLength - 1);
        if (value >= validPageMin && value <= validPageMax) {
            if (floatArea < 0.3) {
                return 1 - floatArea * 1.5;
            }
            else if (floatArea < 0.7) {
                return 0.55;
            }
            else {
                return 0.55 + (floatArea - 0.7) * 1.5;
            }
        }
        else if (value < validPageMin) {
            return 0.55 + (floatArea - 0.7) * 1.5;
        }
        else if (value > validPageMax) {
            return 1 - floatArea * 1.5;
        }
        else {
            // NOT HAPPENED
            return 0;
        }
    };
    ZoomOutPageTransitionMethod.prototype.scale = function (data, value, pageIndex) {
        var floatArea = value - Math.floor(value);
        if (floatArea < 0.2) {
            return 1 - floatArea / 4;
        }
        else if (floatArea < 0.8) {
            return 0.95;
        }
        else {
            return 0.95 + (floatArea - 0.8) / 4;
        }
    };
    return ZoomOutPageTransitionMethod;
}(PageTransitionMethod));
export default ZoomOutPageTransitionMethod;
