import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloBoardComponent } from './solo-board.component';

describe('SoloBoardComponent', () => {
  let component: SoloBoardComponent;
  let fixture: ComponentFixture<SoloBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoloBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
