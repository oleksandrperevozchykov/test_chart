import {Candlestick} from "./types";
const AXIOS_HEIGHT = 50;
const CHART_MARGIN = 50;
export default class ChartView {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    public drawChart(data: Candlestick[]) {
        const candleWidth =  (this.canvas.width - 50)/(data.length + ((data.length + 1)/2));
        const highestPrice = Math.max(...data.map(candle => candle.high));
        const lowestPrice = Math.min(...data.map(candle => candle.low));
        const priceRange: number = Number((highestPrice - lowestPrice).toFixed(5));
        const chartHeight = this.canvas.height - AXIOS_HEIGHT - (2 * CHART_MARGIN);
        const timeRange = data.length <= 10 ? 1 : data.length <= 50 ? 2 : data.length <= 100 ? 5 : data.length <= 500 ? 10 : 20

        const range = this.getYAxis(highestPrice, lowestPrice, priceRange);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(50, 0, this.canvas.width, this.canvas.height - 50);
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(0, 0, 50, this.canvas.height);
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, this.canvas.width - 50);
        this.drawAxis(range, chartHeight, priceRange, lowestPrice);
        data.forEach((candle, index) => {
            const x = 50 + candleWidth * 0.75 + (index * (candleWidth + candleWidth/2));

            if (index % timeRange == 0) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'grey';
                this.ctx.lineWidth = 0.5;
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
                this.ctx.fillStyle = 'black';
                this.ctx.textAlign = 'center';
                const date = new Date(candle.time * 1000);
                const options: Intl.DateTimeFormatOptions = {hour: 'numeric', minute: 'numeric' , hour12: false};
                const text = date.toLocaleString('en-US', options);
                this.ctx.fillText(text, x, this.canvas.height - 25);
            }

            const yHigh = chartHeight - chartHeight / (priceRange) * (candle.high - lowestPrice) + CHART_MARGIN;
            const yLow = chartHeight - chartHeight / (priceRange) * (candle.low - lowestPrice) + CHART_MARGIN;
            const yOpen = chartHeight - chartHeight / (priceRange) * (candle.open - lowestPrice) + CHART_MARGIN;
            const yClose = chartHeight - chartHeight / (priceRange) * (candle.close - lowestPrice) + CHART_MARGIN;

            this.ctx.beginPath();
            this.ctx.strokeStyle = candle.open < candle.close ? 'green' : 'red';
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(x, yHigh);
            this.ctx.lineTo(x, yLow);
            this.ctx.stroke();

            this.ctx.fillStyle = candle.open < candle.close ? 'green' : 'red';
            this.ctx.fillRect(x - candleWidth / 2, Math.min(yOpen, yClose), candleWidth, Math.abs(yOpen - yClose));
        });


    }

    protected drawAxis(axis: number[], chartHeight: number, priceRange: number, lowestPrice: number): void {
        axis.forEach((ax) => {
            const y = chartHeight - chartHeight / (priceRange) * (ax - lowestPrice) + CHART_MARGIN;
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'grey';
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();

            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(ax.toString(), 25, y);
        } )
    }

    protected getYAxis(highestPrice: number, lowestPrice: number, priceRange: number): number[] {
        const YAxis: number[] = [];
        const splitted = (priceRange).toString().split(".");
        let multiplier = 1;
        if (splitted[0] === "0") {
              multiplier = Math.pow(10,  splitted[1].length - 1)
        }
        const highest = Math.ceil(highestPrice * multiplier);
        const lowest = Math.floor(lowestPrice * multiplier);
        const step = Math.floor((highest - lowest)/10);
        let x = lowest
        while (x <= highest) {
            YAxis.push(x/multiplier);
            x += step;
        }
        return YAxis
    }
}