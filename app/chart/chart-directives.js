angular.module('sv-metrics.charts', [])
.directive('svmChart', [function(){
  return {
        restrict: 'EA',
        scope: {
            config: '='
        },
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){

          /*
          $scope.width=  $scope.config.width?$scope.config.width:750;
          $scope.height= $scope.config.height?$scope.config.width:300;

          $element.css({width:$scope.width+"px",height:$scope.height+"px"});
          */
          $element.css({width:"100%",height:"100%","padding":"15px"});
          $scope.d3Call = function(data, chart){

                    chart.xAxis.tickFormat(function(d) {
                        return d3.time.format("%H:%M:%S")(new Date(d))
                    });

                    //if an id is not supplied, create a random id.
                    var dataAttributeChartID= 'chartid' + Math.floor(Math.random()*1000000001);
                    $element.attr('data-chartid', dataAttributeChartID);
                    if(d3.select('[data-chartid=' + dataAttributeChartID + '] svg').empty()) {
                          d3.select('[data-chartid=' + dataAttributeChartID + ']').append('svg')
                                .attr('height', $scope.height)
                                .attr('width', $scope.width)
                                .datum(data)
                                .transition().duration(250)
                                .call(chart);
                    } else {
                          d3.select('[data-chartid=' + dataAttributeChartID + '] svg')
                                .attr('height', $scope.height)
                                .attr('width', $scope.width)
                                .datum(data)
                                .transition().duration( 250 )
                                .call(chart);
                    }
          };
        }],
        link: function(scope, element, attrs){

            function refresh(data){
                  return scope.d3Call(data, scope.chart);
            }

            nv.addGraph({
                        generate: function(){

                            scope.margin = {left: 50, top: 50, bottom: 50, right: 50};

                            var chart = nv.models.lineChart()
                                .width(scope.width)
                                .height(scope.height)
                                .margin(scope.margin)
                                .x(function(d){ return d[0]; })
                                .y(function(d){ return d[1]; })
                                .forceX([]) // List of numbers to Force into the X scale (ie. 0, or a max / min, etc.)
                                .forceY([0]) // List of numbers to Force into the Y scale
                                //.size(100) // point size
                                //.forceSize([]) // List of numbers to Force into the Size scale
                                .showLegend(false)
                                //.showControls(attrs.showcontrols === undefined ? false : (attrs.showcontrols === 'true'))
                                .showXAxis(true)
                                .showYAxis(true)
                                .tooltips(true)
                                .noData('No Data Available.')
                                .interactive(true)
                                .clipEdge(false)
                                .color(nv.utils.defaultColor());


                            chart.useInteractiveGuideline(false);

                            chart.useVoronoi(false); // bug: https://github.com/novus/nvd3/issues/402


                            //chart.style();    //stack, stream, stream-center, expand

                            // chart.order(attrs.order);
                            // chart.offset(attrs.offset);       //zero, wiggle, silhouette, expand
                            // chart.interpolate(attrs.interpolate);
                            // chart.tooltipContent(scope.tooltipcontent());

                            // chart.xScale(scope.xscale());
                            // chart.yScale(scope.yscale());


                            scope.d3Call(scope.config.data, chart);
                            nv.utils.windowResize(chart.update);
                            scope.chart = chart;
                            return chart;
                        },
                        callback:  null
          });


          //scope.$watch("data", refresh, false /*objectEquality*/);
          scope.$on("mx-ud",function(){
            refresh(scope.config.data);
          });
        }
  };
}])
