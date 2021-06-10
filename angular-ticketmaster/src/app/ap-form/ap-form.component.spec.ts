import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApFormComponent } from './ap-form.component';

describe('ApFormComponent', () => {
  let component: ApFormComponent;
  let fixture: ComponentFixture<ApFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
