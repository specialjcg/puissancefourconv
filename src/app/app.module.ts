import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import { TablpuissComponent } from '../tablpuiss/tablpuiss.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
@NgModule({
  declarations: [
    AppComponent,
    TablpuissComponent,
    LineChartComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, BrowserAnimationsModule, MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
