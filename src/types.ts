export interface Candlestick {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface ChartData {
    timeStart: number;
    bars: Candlestick[];
}