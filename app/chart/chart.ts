import {Chart as ChartConfig} from 'configure/configuration';

export class Chart {

    id: string;
    config: ChartConfig;
    chart: any; // nv.Chart;

    constructor(chartId: string, config: ChartConfig) {
        this.id = chartId;
        this.config = config;
    }

    /** */
    public update(): void {
        // this.chart.update();
    }

}
