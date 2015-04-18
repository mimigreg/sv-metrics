import {Chart} from 'chart/chart';
import {registry} from 'metrics/MetricsRegistry';

// HistogramChart
// https://github.com/nvd3-community/nvd3/blob/gh-pages/examples/discreteBarChart.html
export class HistogramChart extends Chart{


  // data

  /** */
  constructor(chartId,config){

    super(chartId,config);


    // count,max,mean,median,min,p75,p95,p99,p999,stddev,sum,variance
    this.data= [
      {
        key:"xx",
      values:[
        {label:'mean', value:0},
        {label:'median', value:0},
        {label:'p75',  value:0},
        {label:'p95',  value:0},
        {label:'p99',  value:0},
        {label:'p999', value:0}
      ]}
    ];
    this.updateData();

    var self= this;

    nv.addGraph(function(){

        self.chart = nv.models.discreteBarChart()
                  .x(function(d) { return d.label })
                  .y(function(d) {
                    return d.value
                  })
                  .staggerLabels(true)
                  //.staggerLabels(historicalBarChart[0].values.length > 8)
                  .showValues(true)
                  .duration(250);

        d3.select('[data-chartid=' + chartId + ']').append('svg')
                .datum(self.data)
                .call(self.chart);

        nv.utils.windowResize(self.chart.update);

        return self.chart;
    })
  }

  updateData(){

          var val= registry.getValue(this.config.series[0].metricId);
          if(val && val.value){
                this.data[0].values[0].value= val.value.mean;
                this.data[0].values[1].value= val.value.median;
                this.data[0].values[2].value= val.value.p75;
                this.data[0].values[3].value= val.value.p95;
                this.data[0].values[4].value= val.value.p99;
                this.data[0].values[5].value= val.value.p999;
          }

  }

  update(){
      this.updateData();
      this.chart.update();
  }
};
