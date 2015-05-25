import {registry} from 'metrics/MetricsRegistry';
import {Chart} from 'chart/chart';


export class PieChart extends Chart{

  // config: configure.Chart
  // chart: nv.Chart;
  // data: Object;

  /** */
  constructor(chartId, config){

    super(chartId,config);

    var self= this;

    this.data= [];


    for(var s of this.config.series){

        var val= registry.getValue(s.metricId);
        this.data.push(
          {
                key:s.name,
                metricId: s.metricId,
                value: val ? val.value : 0
          }
        );
    }


    nv.addGraph(function(){

          var chart = nv.models.pieChart()
                        //.width(scope.width)
                        //.height(scope.height)
                        .margin({left: 10, top: 10, bottom: 10, right: 10})
                        .x(function(d){ return d.key; })
                        .y(function(d){ return d.value; })
                        .color(d3.scale.category20().range().slice(8))
                        .growOnHover(false)
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

  update(){

      for(var s of this.data){
        var val= registry.getValue(s.metricId);
        if(s.value!==val.value){
          s.value= val.value;
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
