/// <reference path="../../typings/d3/d3.d.ts"/>

import {Chart} from 'chart/chart';
import {registry} from 'core/MetricsRegistry';
import {Meter} from 'core/metrics';

interface BulletData{
  metricId:string,
  title:string,
  subtitle:string,
  rangeLabels:string[],
  measureLabels:string[],
  markerLabels:string[],
  ranges:number[],
  markers:number[],
  measures:number[]
}

// BulletChart
//
// https://github.com/nvd3-community/nvd3/blob/gh-pages/examples/bulletChart.html
export class BulletChart extends Chart{

  // chart: nv.Chart;
  data: BulletData[];
  vis: any;

  /** */
  constructor(chartId,config){

    super(chartId,config);

    var self= this;

    this.data= [];
    for(let s of config.series){
      self.data.push({
        title: s.name,
        subtitle: '(rq/sec)',
        rangeLabels: ['15 min Rate','Mean Rate','5min Rate'],
        measureLabels:['Current Rate'],
        markerLabels:['Previous Current Rate'],
        metricId: s.metricId,
        ranges:[0,0,0],
        markers:[0],
        measures:[0]
      });
    }
    this.updateData();

    nv.addGraph(function(){

        var width=500,height=100;
        var margin={right:10,left:10,top:10,bottom:10};

        self.chart = nv.models.bulletChart()
              .width(width - margin.right - margin.left)
              .height(height - margin.top - margin.bottom);

        self.vis= d3.select('[data-chartid=' + chartId + ']').selectAll("svg")
        //var vis = d3.select("#chart").selectAll("svg")
              .data(self.data)
              .enter().append("svg")
              .attr("class", "bullet nvd3")
              .attr("style", "height:100px")
              /*.attr("width", width)
              .attr("height", height);*/
              ;

        self.vis.transition().duration(250).call(self.chart);


        return self.chart;
    });
  }

  updateData(){
      for(let m of this.data){
          var mxVal= registry.getValue(m.metricId);
          if(mxVal && mxVal.value){
              var val:Meter= <Meter>mxVal.value;
                //m.ranges= [val.value.max,val.value.mean,val.value.min];
                m.ranges= [val.m15_rate,val.mean_rate,val.m5_rate];
                m.markers= m.measures?m.measures:[0]; // previous
                m.measures= [val.m1_rate];
          }
      }

  }

  update(){
      //this.data[0].markers[0]=200;
      this.updateData();
      this.vis.data(this.data).transition().duration(250).call(this.chart);
      //this.chart.update();
  }

}
