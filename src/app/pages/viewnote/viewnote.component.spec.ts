import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewnoteComponent } from './viewnote.component';

describe('ViewnoteComponent', () => {
  let component: ViewnoteComponent;
  let fixture: ComponentFixture<ViewnoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewnoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
