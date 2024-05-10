import axios from "axios";
import {Candlestick, ChartData} from "./types";

const DATA_URL = 'https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&Symbol=EURUSD&Timeframe=1&Start=57674&End=59113&UseMessagePack=false';
export default class NetController {

    public async MakeHttpRequest(): Promise<any> {
        return new Promise(async (resolve) => {
            try {
                const response = await axios.get(DATA_URL);
                resolve(response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })
    }

    public ParseData(data: any): ChartData[] {
        const parsedData: ChartData[] = [];
        if (Array.isArray(data)) {
            data.forEach((a) => {
                parsedData.push({
                    timeStart: a.ChunkStart,
                    bars: this.parseBars(a.Bars, a.ChunkStart)
                })
            })
        }
        return parsedData;
    }

    protected parseBars(bars: any[], timeStart: number): Candlestick[] {
        let parsedData: Candlestick[] = [];

        bars.forEach((bar: any) => {
            const parsedBar: Candlestick = {
                time: timeStart + bar.Time,
                open: bar.Open,
                close: bar.Close,
                high: bar.High,
                low: bar.Low,
                volume: bar.TickVolume,
            }
            parsedData.push(parsedBar);
        })
        parsedData = parsedData.sort((bar: Candlestick) => bar.time);
        return parsedData;
    }
}