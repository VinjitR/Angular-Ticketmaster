import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvedetailsComponent } from './evedetails.component';

describe('EvedetailsComponent', () => {
  let component: EvedetailsComponent;
  let fixture: ComponentFixture<EvedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
