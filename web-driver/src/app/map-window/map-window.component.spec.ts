import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWindowComponent } from './map-window.component';

describe('MapWindowComponent', () => {
  let component: MapWindowComponent;
  let fixture: ComponentFixture<MapWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
