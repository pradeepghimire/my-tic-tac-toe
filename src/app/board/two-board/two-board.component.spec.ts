import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoBoardComponent } from './two-board.component';

describe('TwoBoardComponent', () => {
  let component: TwoBoardComponent;
  let fixture: ComponentFixture<TwoBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
