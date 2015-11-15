import {registry,MetricsValue,Counter,Gauge,Meter,Histogram,Timer} from 'core/MetricsRegistry';


class Row {

  public id: string;
  public mx: MetricsValue;

  constructor(id: string, mx: MetricsValue) {
    this.id = id;
    this.mx = mx;
  }
}


export class MetricsViewCtrl{

  private rows: Row[] = [];

  constructor(){
     let metrics = registry.getMetrics();
     metrics.forEach(
      (v, k) => this.rows.push(new Row(k, v))
    );
  }

  public isCounter(row: Row): boolean {
    return row.mx.value.constructor === Counter;
  }

  public isGauge(row: Row): boolean {
    return row.mx.value.constructor === Gauge;
  }

  public isHistogram(row: Row): boolean{
    return row.mx.value.constructor === Histogram;
  }

  public isMeter(row: Row): boolean{
    return row.mx.value.constructor === Meter;
  }

  public isTimer(row:Row):boolean{
    return row.mx.value.constructor === Timer;
  }

  // needed by virtual scrolling "md-on-demande"
  public getItemAtIndex(idx: number): Row {
    return this.rows[idx];
  }
  // needed by virtual scrolling "md-on-demande"
  public getLength(): number {
    return this.rows.length;
  }

  public view(row: Row) {
    if(this.isCounter(row)) {
      console.error('counter view not yet implemented!');
    }else if(this.isGauge(row)) {
      window.document.location.href = '#/view/metrics/gauge/' + row.id;
    }else if(this.isHistogram(row)) {
      console.error('histogram view not yet implemented!');
    }else if(this.isMeter(row)){
      window.document.location.href = '#/view/metrics/meter/' + row.id;
    }else if(this.isTimer(row)){
      console.log('timer');
      window.document.location.href = '#/view/metrics/timer/' + row.id;
    }else{
      console.error('view: ' + row.id);
    }
  }

}
