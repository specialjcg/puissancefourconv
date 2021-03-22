import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TablpuissComponent} from './tablpuiss.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {LineChartComponent} from '../app/line-chart/line-chart.component';
import {BarChartComponent} from '../app/bar-chart/bar-chart.component';

describe('TablpuissComponent', () => {
  let component: TablpuissComponent;
  let fixture: ComponentFixture<TablpuissComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TablpuissComponent, LineChartComponent, BarChartComponent],
      imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, MatTableModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(TablpuissComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
