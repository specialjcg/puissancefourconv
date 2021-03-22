import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import * as d3js from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() data: { red: number; numberGame: number; blue: number }[];
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;


  constructor() {
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
    this.buildSvg();
    this.addXandYAxis();
    this.drawLineAndPath();
  }

  ngOnChanges(): void {
    if (this.svg !== undefined) {
      this.svg.remove();
    }
    this.buildSvg();
    this.addXandYAxis();
    this.drawLineAndPath();

  }

  private buildSvg(): void {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private addXandYAxis(): void {
    // range of data configuring
    this.x = d3Scale.scaleLinear().range([0, this.width - 100]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain([0, 800]).nice();
    this.y.domain([0, 100]);
    const yaxis = d3js.axisLeft(this.y);
    const xaxis = d3js.axisBottom(this.x);
    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xaxis);

    this.svg.append('g')
      .attr('class', 'axis')
      .call(yaxis);


  }

  private drawLineAndPath(): void {

      this.line = d3Shape.line()
        .x((d: any) => this.x(d.numberGame))
        .y((d: any) => this.y(d.blue));
      // Configuring line path
     if (this.line !==  undefined) {
      this.svg.append('path')
        .datum(this.data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', this.line);
    }
  }
}
