"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PageTransitionMethod_1 = __importDefault(require("../PageTransitionMethod"));
var DefaultPageTransitionMethod = /** @class */ (function (_super) {
    __extends(DefaultPageTransitionMethod, _super);
    function DefaultPageTransitionMethod() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.PAGER_MEMORY_SCROLL_AMOUNT = 8;
        return _this;
    }
    DefaultPageTransitionMethod.prototype.position = function (data, pageIndex) {
        return (pageIndex * (100 / this.PAGER_MEMORY_SCROLL_AMOUNT)) + "%";
    };
    DefaultPageTransitionMethod.prototype.scroll = function (data, value) {
        var scrollAmountPerPage = data.dimension[(data.orientation === "vertical") ? "height" : "width"] / this.PAGER_MEMORY_SCROLL_AMOUNT;
        var intValue = Math.floor(value);
        var floatArea = value - intValue;
        if (data.overscroll && value < 1) {
            return scrollAmountPerPage * (intValue + (3 / 4 + floatArea / 4));
        }
        else if (data.overscroll && value > data.pageLength) {
            return scrollAmountPerPage * (intValue + 1 / 4 * floatArea);
        }
        else {
            return scrollAmountPerPage * (intValue +
                ((floatArea >= 0.5) ? ((-128) * Math.pow(floatArea - 1, 8) + 1) : 128 * Math.pow(floatArea, 8)));
        }
    };
    DefaultPageTransitionMethod.prototype.translate = function (data, value, pageIndex) {
        return "0%";
    };
    DefaultPageTransitionMethod.prototype.opacity = function (data, value, pageIndex) {
        var validPageMin = ((data.overscroll) ? 1 : 0);
        var validPageMax = ((data.overscroll) ? data.pageLength : data.pageLength - 1);
        if (value >= validPageMin && value <= validPageMax) {
            return Math.max(-2 * Math.abs(value - pageIndex) + 1, 0);
        }
        else if (value < validPageMin) {
            return Math.max(-1 * pageIndex + 2, 0);
        }
        else if (value > validPageMax) {
            return Math.max(pageIndex - validPageMax + 1, 0);
        }
        return 0;
    };
    DefaultPageTransitionMethod.prototype.scale = function (data, value, pageIndex) {
        return 1.0;
    };
    return DefaultPageTransitionMethod;
}(PageTransitionMethod_1.default));
exports.default = DefaultPageTransitionMethod;
