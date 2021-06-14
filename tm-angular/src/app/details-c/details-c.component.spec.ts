import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCComponent } from './details-c.component';

describe('DetailsCComponent', () => {
  let component: DetailsCComponent;
  let fixture: ComponentFixture<DetailsCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
