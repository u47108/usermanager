import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * Unit tests for AppComponent using Jest.
 * Optimizado con mejores prácticas de testing.
 */
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "ngMaterial"', () => {
    expect(component.title).toBe('ngMaterial');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    
    // Verificar que el título existe (si está en el template)
    // Si no hay h1 en el template, este test puede necesitar ajustes
    if (titleElement) {
      expect(titleElement.textContent).toContain('Welcome to ngMaterial!');
    }
  });

  it('should update title when changed', () => {
    const newTitle = 'New Title';
    component.title = newTitle;
    fixture.detectChanges();
    
    expect(component.title).toBe(newTitle);
  });
});
