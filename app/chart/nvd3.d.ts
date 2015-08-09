/// <reference path="../../typings/d3/d3.d.ts"/>
declare module nvd3{

  interface Tooltip{
		enabled(b:boolean):void;
	}

	interface Chart{
		(transition:any,...args:any[]):any, // (transition: Transition<Datum>, ...args: any[]) => any
		tooltip:Tooltip
	}

	interface Axis{
		tickFormat: (fn:(n:number)=>string)=>any
	}

	interface LineChart extends Chart{

		margin(margin:{left:number,top:number,bottom:number,right:number}):LineChart;
		x(fx:(any)=>number):LineChart;
		y(fy:(any)=>number):LineChart;
		forceX(n:number[]):LineChart;
		forceY(n:number[]):LineChart;
		showLegend(b:boolean):LineChart;
		showXAxis(b:boolean):LineChart;
		showYAxis(b:boolean):LineChart;
		noData(msg:string):LineChart;
		interactive(b:boolean):LineChart;
		clipEdge(b:boolean):LineChart;
		color(c:any):LineChart;
		useInteractiveGuideline(b:boolean):LineChart;
		useVoronoi(b:boolean):LineChart;

		update():void;

		xAxis:Axis;
		yAxis:Axis;
	}

	interface MultiBarChart extends Chart{
		clipEdge(b:boolean):MultiBarChart;
		color(c:any):MultiBarChart;
		margin(margin:{left:number,top:number,bottom:number,right:number}):MultiBarChart;
		x(fx:(any)=>number):MultiBarChart;
		y(fy:(any)=>number):MultiBarChart;
		showXAxis(b:boolean):MultiBarChart;
		showYAxis(b:boolean):MultiBarChart;

		update():void;

		xAxis:Axis;
		yAxis:Axis;
	}

	interface DiscreteBarChart extends Chart{
		duration(d:number):DiscreteBarChart;
		x(fx:(any)=>number):DiscreteBarChart;
		y(fy:(any)=>number):DiscreteBarChart;
		showValues(b:boolean):DiscreteBarChart;
		staggerLabels(b:boolean):DiscreteBarChart;

		update():void;
	}

	interface PieChart extends Chart{

		color(c:any):PieChart;
		margin(margin:{left:number,top:number,bottom:number,right:number}):PieChart;
		labelType(type:string):PieChart;
		x(fx:(any)=>string):PieChart;
		y(fy:(any)=>number):PieChart;
		growOnHover(b:boolean):PieChart;
		noData(msg:string):PieChart;

		update():void;
	}

	interface BulletChart extends Chart{
		width(width:number):BulletChart;
		height(height:number):BulletChart;
	}

	interface Models{
		lineChart():LineChart;
		multiBarChart():MultiBarChart;
		discreteBarChart():DiscreteBarChart;
		pieChart():PieChart;
		bulletChart():BulletChart;

	}

	interface Utils{
		defaultColor():any;
		windowResize(handler:Function):any;
	}

	interface NVD3{

		addGraph(callback:()=>Chart):void;
		models:Models;
		utils:Utils;
	}

}

declare var nv: nvd3.NVD3;

declare module 'nvd3' {
    export = nv;
}
