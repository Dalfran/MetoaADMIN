import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetDetail } from './trajet-detail';

describe('TrajetDetail', () => {
  let component: TrajetDetail;
  let fixture: ComponentFixture<TrajetDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrajetDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(TrajetDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
