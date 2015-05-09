import {Chart} from 'chart/chart';
import {registry} from 'metrics/MetricsRegistry';

// BulletChart
//
// https://github.com/nvd3-community/nvd3/blob/gh-pages/examples/bulletChart.html
export class BulletChart extends Chart{

  // chart: nv.Chart;

  /** */
  constructor(chartId,config){

    super(chartId);

    var self= this;

    this.data= [];
    for(let s of config.series){
      self.data.push({
        title: s.name,
        subtitle: '(rq/sec)',
        rangeLabels: ['15 min Rate','Mean Rate','5min Rate'],
        measureLabels:['Current Rate'],
        markerLabels:['Previous Current Rate'],
        metricId: s.metricId
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
          var val= registry.getValue(m.metricId);
          if(val && val.value){
                //m.ranges= [val.value.max,val.value.mean,val.value.min];
                m.ranges= [val.value['15MinuteRate'],val.value.meanRate,val.value['5MinuteRate']];
                m.markers= m.measures?m.measures:[0]; // previous
                m.measures= [val.value.currentRate];
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
