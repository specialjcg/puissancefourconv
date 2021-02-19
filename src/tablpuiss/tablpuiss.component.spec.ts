import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablpuissComponent } from './tablpuiss.component';

describe('TablpuissComponent', () => {
  let component: TablpuissComponent;
  let fixture: ComponentFixture<TablpuissComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablpuissComponent ]
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
