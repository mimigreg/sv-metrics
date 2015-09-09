/// <reference path="../../typings/d3/d3.d.ts"/>

import {registry} from 'metrics/MetricsRegistry';
import {Chart} from 'chart/chart';
import {Chart as ChartConfig} from 'configure/configuration';

// systemjs erreor: "Invalid anonymous System.register module load"
// https://github.com/Microsoft/TypeScript/commit/a4a1a51db6968bd13c8be02af4900083b2f0584c

interface BarChartData {
  key:string,
  metricId:string,
  values:{date:Date,value:number}[]
}

export class BarChart extends Chart{

  data: BarChartData[];

  /** */
  constructor(chartId:string, config:ChartConfig){

    super(chartId,config);

    var self= this;

    this.data= [];


    for(var s of this.config.series){

        var val= registry.getValue(s.metricId);
        this.data.push(
          {
                key:s.name,
                metricId: s.metricId,
                values: val ? val.timeline.timeline : []
          }
        );
    }


    nv.addGraph(function(){

          var chart = nv.models.multiBarChart()
                        //.width(scope.width)
                        //.height(scope.height)
                        .margin({left: 60, top: 50, bottom: 50, right: 50})
                        .x(function(d){ return d.date; })
                        .y(function(d){ return d.value; })
                        //.forceX([]) // List of numbers to Force into the X scale (ie. 0, or a max / min, etc.)
                        //.forceY([0]) // List of numbers to Force into the Y scale
                        //.size(100) // point size
                        //.forceSize([]) // List of numbers to Force into the Size scale
                        //.showLegend(false)
                        //.showControls(attrs.showcontrols === undefined ? false : (attrs.showcontrols === 'true'))
                        .showXAxis(true).showYAxis(true)
                        //.noData('No Data Available.')
                        //.interactive(true)
                        .clipEdge(false)
                        .color(nv.utils.defaultColor());


          chart.tooltip.enabled(true);
          //chart.useInteractiveGuideline(false);

          //chart.useVoronoi(false); // bug: https://github.com/novus/nvd3/issues/402


                    //chart.style();    //stack, stream, stream-center, expand

                    // chart.order(attrs.order);
                    // chart.offset(attrs.offset);       //zero, wiggle, silhouette, expand
                    // chart.interpolate(attrs.interpolate);
                    // chart.tooltipContent(scope.tooltipcontent());

                    // chart.xScale(scope.xscale());
                    // chart.yScale(scope.yscale());


          nv.utils.windowResize(chart.update);


          chart.xAxis.tickFormat(function(d) {
                  return d3.time.format("%H:%M:%S")(new Date(d));
          });

          chart.yAxis
                  //.axisLabel('Voltage (v)')
                  .tickFormat(d3.format('>.3r'));

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

  update(){

      for(var d of this.data){
        var val= registry.getValue(d.metricId);
        if(val && d.values!==val.timeline.timeline){
          d.values= val.timeline.timeline;
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
