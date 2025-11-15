import { 
  Component, 
  OnInit, 
  Input, 
  OnDestroy, 
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { User } from '../../models/users';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  MatDialog, 
  MatSnackBarRef, 
  SimpleSnackBar, 
  MatSnackBar, 
  MatDialogConfig 
} from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { EditEmployeeDialogComponent } from '../edit-employee-dialog/edit-employee-dialog.component';
import { 
  debounceTime, 
  distinctUntilChanged, 
  takeUntil 
} from 'rxjs/operators';

/**
 * Main Content Component - Displays employee list with search and CRUD operations
 * Optimized for performance with OnPush change detection and debounced search
 */
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Performance optimization
})
export class MainContentComponent implements OnInit, OnDestroy {
  @Input() employeesData: Observable<User[]>;
  
  // Component state
  employees: User[] = [];
  filteredEmployees: User[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  showLoadMore: boolean = false;
  
  // Pagination (for future implementation)
  private currentPage: number = 1;
  private readonly itemsPerPage: number = 20;
  
  // RxJS subjects for cleanup
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // Required for OnPush
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Setup debounced search for performance
   */
  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only trigger if value changed
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.filterEmployees(searchTerm);
        this.cdr.markForCheck();
      });
  }

  /**
   * Load employees from service
   */
  private loadEmployees(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck();

    // Subscribe to employee data
    if (!this.employeesData) {
      this.employeesData = this.employeeService.employeesSet;
    }

    const employeesSub = this.employeesData
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.employees = data || [];
          this.filteredEmployees = [...this.employees];
          this.isLoading = false;
          this.error = null;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err?.message || 'Error al cargar los empleados';
          this.employees = [];
          this.filteredEmployees = [];
          this.cdr.markForCheck();
          console.error('Error loading employees:', err);
        }
      });

    this.subscriptions.push(employeesSub);

    // Trigger load
    const loadSub = this.employeeService.getJSON()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          this.isLoading = false;
          this.error = err?.message || 'Error al cargar los empleados';
          this.cdr.markForCheck();
        }
      });

    this.subscriptions.push(loadSub);
  }

  /**
   * Retry loading employees
   */
  retryLoad(): void {
    this.loadEmployees();
  }

  /**
   * Handle search input changes with debouncing
   */
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.searchSubject.next(this.searchQuery);
  }

  /**
   * Clear search query
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.filterEmployees('');
    this.cdr.markForCheck();
  }

  /**
   * Filter employees based on search query
   * Optimized for performance with early returns
   */
  private filterEmployees(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim().length === 0) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    const query = searchTerm.toLowerCase().trim();
    
    // Efficient filtering with multiple criteria
    this.filteredEmployees = this.employees.filter(emp => {
      const fullName = `${emp.nombre || ''} ${emp.apellido || ''}`.toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const profesion = (emp.profesion || '').toLowerCase();
      
      return fullName.includes(query) || 
             email.includes(query) || 
             profesion.includes(query);
    });
  }

  /**
   * TrackBy function for ngFor performance optimization
   */
  trackByEmployeeId(index: number, employee: User): number | undefined {
    return employee?.id;
  }

  /**
   * Open edit employee dialog
   */
  openEmployeeDialog(index: number, employee: User): void {
    if (!employee) {
      return;
    }

    const dialogConfig: MatDialogConfig = {
      disableClose: true,
      autoFocus: true,
      width: '450px',
      maxWidth: '90vw',
      data: {
        id: employee.id,
        nombre: employee.nombre,
        apellido: employee.apellido,
        email: employee.email,
        profesion: employee.profesion
      },
      panelClass: 'employee-dialog'
    };

    const dialogRef: MatDialogRef<EditEmployeeDialogComponent> = 
      this.dialog.open(EditEmployeeDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            this.openSnackBar('Empleado actualizado exitosamente', 'Cerrar');
          }
        },
        error: (err) => {
          console.error('Error in dialog:', err);
          this.openSnackBar('Error al actualizar empleado', 'Cerrar');
        }
      });
  }

  /**
   * Confirm and delete employee
   */
  confirmDelete(index: number, employee: User): void {
    if (!employee || !employee.id) {
      return;
    }

    const fullName = `${employee.nombre || ''} ${employee.apellido || ''}`.trim() || 'este empleado';
    
    // Use browser confirm for simplicity (could be replaced with MatDialog)
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${fullName}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmed) {
      this.deleteItem(index, employee.id.toString());
    }
  }

  /**
   * Delete employee item
   */
  deleteItem(index: number, id: string): void {
    if (!id) {
      this.openSnackBar('ID de empleado inválido', 'Cerrar');
      return;
    }

    try {
      this.employeeService.deleteEmployee(index, id);
      
      // Update local arrays
      this.employees = this.employees.filter((_, i) => i !== index);
      this.filterEmployees(this.searchQuery);
      
      this.openSnackBar('Empleado eliminado exitosamente', 'Cerrar');
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error deleting employee:', error);
      this.openSnackBar('Error al eliminar empleado', 'Cerrar');
    }
  }

  /**
   * Load more items (for pagination)
   */
  loadMore(): void {
    // Future implementation for pagination
    this.currentPage++;
    // Load more logic here
  }

  /**
   * Show snackbar notification
   */
  private openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }
}
