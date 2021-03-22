import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3js from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit, OnChanges {


  @Input() data: number[];
 // data: number[];
  public scaleFactor: number;
  private x: any;
  private y: any;
  private svg: any;
  private width: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private height: number;


  constructor() {
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.data = [];
  //  this.data = [5, 10, 20, 30, 40, 50, 80];
  }

  ngOnInit(): void {
    this.svg = d3.select('svg.bar');
    this.buildSvg();
  }

  ngOnChanges(): void {
    if (this.svg !== undefined) {
      this.svg.remove();

    }
    this.buildSvg();

  }

  private buildSvg(): void {
    this.svg = d3.select('svg.bar')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleBand().range([0, this.width - 100]).padding(0.1);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(this.data.map(d => this.data.indexOf(d)));
    this.y.domain([0, 100]);

    const g = this.svg.append('g')
      .attr('transform', 'translate(' + 10 + ',' + 0 + ')');
    g.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3js.axisBottom(this.x));

    g.append('g')
      .call(d3js.axisLeft(this.y).ticks(10));


    g.selectAll('.bar')
      .data(this.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.x(this.data.indexOf(d)))
      .attr('y', d => this.y(d))
      .attr('width', this.x.bandwidth())
      .attr('height', d => this.height - this.y(d));

    this.svg.selectAll('bar')
      .data(this.data)
      .enter()
      .append('text')
      .text(d => parseInt(d, 0))
      .attr('x', d => this.x(this.data.indexOf(d)) + this.x.bandwidth() / 2 + 10)
      .attr('y', d => this.y(d) + 14)
      .attr('font-family', 'Lucida Console')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle');
  }

}
