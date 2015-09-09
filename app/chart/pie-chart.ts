/// <reference path="../../typings/d3/d3.d.ts"/>

import {registry,MetricsValue,TYPES} from 'metrics/MetricsRegistry';
import {Gauge,Meter,Histogram,Timer} from 'metrics/metrics';
import {Chart} from 'chart/chart';
import {Chart as ChartConfig} from 'configure/configuration';

class PieChartData{

  key: string;
  metricId: string;
  value: number;

  constructor(key:string,mxId:string,value:number){
    this.key=key;
    this.metricId=mxId;
    this.value= value;
  }
}


function extractData(mx:MetricsValue):number{ // TODO: make extract function configurable

      var value;

      if(mx.value instanceof Gauge){
          value= (<Gauge>mx.value).value;
      }else if(mx.value instanceof Meter){
          value= (<Meter>mx.value).m1_rate;
      }else if(mx.value instanceof Histogram){
        value= (<Histogram>mx.value).mean;
      }else if(mx.value instanceof Timer){
        value= (<Timer>mx.value).mean;
      }else{
        throw Error('Unknown type of metrics: '+mx);
      }
      return value;
}

export class PieChart extends Chart{

  // config: configure.Chart
  // chart: nv.Chart;
  data: PieChartData[];

  /** */
  constructor(chartId:string, config:ChartConfig){

    super(chartId,config);

    var self= this;
    this.data= [];
    this.initPieData();

    nv.addGraph(function(){

          var chart = nv.models.pieChart()
                        //.width(scope.width)
                        //.height(scope.height)
                        .margin({left: 10, top: 10, bottom: 10, right: 10})
                        .x(function(d:PieChartData){
                          return d.key;
                        })
                        .y(function(d:PieChartData){
                          return d.value;
                        })
                        .color(d3.scale.category20().range().slice(8))
                        .growOnHover(false)
                        .noData('No Data Available.')
                        .labelType('value');

          nv.utils.windowResize(chart.update);

          d3.select('[data-chartid=' + chartId + ']').append('svg')
                //.attr('height', scope.height)
                //.attr('width', scope.width)
                .datum(self.data)
                .transition().duration(250)
                .call(chart);


          self.chart = chart;

          return chart;
      });
  }


  private initPieData(){

    var dd:PieChartData[]= [];
    for(var s of this.config.series){
      var mx= registry.getValue(s.metricId);
      if(mx){
        dd.push( new PieChartData(s.name, s.metricId, extractData(mx)) );
      }else{
        console.info('metrics missing:'+s.metricId+' for '+this.config.name);
        break;
      }
    }
    if(dd.length===this.config.series.length){ // update if all values are available
      dd.forEach(d=>this.data.push(d));
    }
  }

  update(){

      if(this.data.length==0){
        this.initPieData();
      }

      for(var d of this.data){
        var mx= registry.getValue(d.metricId);
        if(mx){
          d.value= extractData(mx);
        }
      }

      this.chart.update();

      /*c.unregister= registry.onUpdate(function(){
          for(var d of ch.data){
            var val= registry.getValue(this.chart.metricId);
            this.data.values= val?val.timeline:[];
          }
      });*/
  }

}
