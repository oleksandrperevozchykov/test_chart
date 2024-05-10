import NetController from "./NetController";
import {Candlestick, ChartData} from "./types";
import ChartView from "./ChartView";
export default class MainController {

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    protected netController: NetController;
    protected view: ChartView;

    protected activeData: Candlestick[] = [];
    protected activeRange: number = 50;
    protected activeDataIndex = 0;

    protected pointerDown = false;

    protected data: ChartData[] = [];
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.netController = new NetController();
        this.view = new ChartView(this.canvas, this.ctx)
        console.log(this.data);
    }

    public async start(): Promise<void> {
        await this.GetData();
        const bars = this.data[1].bars;
        this.activeDataIndex = bars.length - 1;
        this.activeData = bars.slice(bars.length - (this.activeRange + 1), this.activeDataIndex);
        this.view.drawChart(this.activeData);

        this.canvas.addEventListener("wheel", (e) => this.onWheel(e), false);
        this.canvas.addEventListener("pointerdown", () => this.onPointerDown(), false);
        this.canvas.addEventListener("pointerup", () => this.onPointerUp(), false);
    }

    protected async GetData(): Promise<void> {
        const [data] = await Promise.all([this.netController.MakeHttpRequest()]);
        this.data.push(...this.netController.ParseData(data));
    }

    protected onPointerDown() {
        this.pointerDown = true;
        this.canvas.addEventListener("pointermove", (e) => this.onPointerMove(e), false);
    }

    protected onPointerUp() {
        this.pointerDown = false;
        this.canvas.removeEventListener("pointermove", (e) => this.onPointerMove(e));
    }

    protected onPointerMove(event: PointerEvent) {
        if (!this.pointerDown) return;
        const bars = this.data[1].bars;
        if (event.movementX > 0 && this.activeDataIndex > this.activeRange) {
            this.activeDataIndex--;
        } else if (event.movementX < 0 && this.activeDataIndex < bars.length) {
            this.activeDataIndex++;
        }
        this.activeData = bars.slice(this.activeDataIndex - (this.activeRange + 1), this.activeDataIndex);
        this.view.drawChart(this.activeData);

    }

    protected onWheel(event: WheelEvent): void {
        if (event.deltaY > 0) {
            if (this.activeRange < 500) {
                this.activeRange++;
            } else {
                return;
            }
            if (this.activeDataIndex < this.data[1].bars.length - 1) this.activeDataIndex++;
        } else if (event.deltaY < 0) {
            if (this.activeRange > 10) {
                this.activeRange--;
            } else {
                return;
            }
            if (this.activeDataIndex < this.data[1].bars.length - 1) this.activeDataIndex++;
        }
        const bars = this.data[1].bars;
        this.activeData = bars.slice(bars.length - (this.activeRange + 1), this.activeDataIndex);
        this.view.drawChart(this.activeData);
    }


}