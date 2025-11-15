import { Injectable } from '@angular/core';
import { User } from '../models/users';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Service for managing employees/users.
 * Optimizado para mejor rendimiento y manejo de errores.
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly URL = 'http://arsene.azurewebsites.net/User';
  private readonly _employeesSet: BehaviorSubject<User[]>;

  private readonly dataStore: {
    employeesSet: User[];
  };

  /**
   * Constructor - inicializa el store y BehaviorSubject
   * Optimizado: inicialización directa
   */
  constructor(private http: HttpClient) {
    this.dataStore = { employeesSet: [] };
    this._employeesSet = new BehaviorSubject<User[]>([]);
  }

  /**
   * Observable para subscribirse a cambios en la lista de empleados
   * @returns Observable<User[]> Lista de empleados
   */
  get employeesSet(): Observable<User[]> {
    return this._employeesSet.asObservable();
  }

  /**
   * Obtiene todos los empleados desde la API
   * Optimizado: mejor manejo de errores y uso de operadores RxJS
   * @returns Observable<User[]> Lista de empleados
   */
  getJSON(): Observable<User[]> {
    return this.http.get<User[]>(this.URL).pipe(
      tap(data => {
        // Actualizar store y notificar a subscribers
        this.dataStore.employeesSet = data || [];
        this._employeesSet.next([...this.dataStore.employeesSet]); // Spread operator para nueva referencia
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Unable to fetch users set!'));
      })
    );
  }

  /**
   * Elimina un usuario
   * Optimizado: mejor manejo de errores y retorna Observable
   * @param id ID del usuario a eliminar
   * @returns Observable<User> Usuario eliminado
   */
  sendDeleteUser(id: string): Observable<User> {
    if (!id || id.trim().length === 0) {
      return throwError(() => new Error('ID cannot be null or empty'));
    }
    
    return this.http.delete<User>(`${this.URL}/${id}`).pipe(
      tap(() => {
        // Actualizar store local después de eliminar
        const index = this.dataStore.employeesSet.findIndex(emp => emp.id?.toString() === id);
        if (index !== -1) {
          this.dataStore.employeesSet.splice(index, 1);
          this._employeesSet.next([...this.dataStore.employeesSet]);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error(`Unable to delete user with id: ${id}`));
      })
    );
  }

  /**
   * Actualiza un usuario
   * Optimizado: mejor manejo de errores
   * @param data Datos del usuario a actualizar
   * @returns Observable<User> Usuario actualizado
   */
  sendUpdateUser(data: User): Observable<User> {
    if (!data || !data.id) {
      return throwError(() => new Error('User data and ID are required'));
    }
    
    return this.http.put<User>(`${this.URL}/${data.id}`, data).pipe(
      tap(updatedUser => {
        // Actualizar store local después de actualizar
        const index = this.dataStore.employeesSet.findIndex(emp => emp.id === data.id);
        if (index !== -1) {
          this.dataStore.employeesSet[index] = updatedUser;
          this._employeesSet.next([...this.dataStore.employeesSet]);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating user:', error);
        return throwError(() => new Error(`Unable to update user with id: ${data.id}`));
      })
    );
  }

  /**
   * Crea un nuevo usuario
   * Optimizado: mejor manejo de errores
   * @param data Datos del usuario a crear
   * @returns Observable<User> Usuario creado
   */
  sendSaveUser(data: User): Observable<User> {
    if (!data) {
      return throwError(() => new Error('User data is required'));
    }
    
    return this.http.post<User>(this.URL, data).pipe(
      tap(newUser => {
        // Agregar al store local después de crear
        this.dataStore.employeesSet.push(newUser);
        this._employeesSet.next([...this.dataStore.employeesSet]);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error saving user:', error);
        return throwError(() => new Error('Unable to save user'));
      })
    );
  }

  /**
   * Busca un empleado por ID
   * Optimizado: uso de for-loop más eficiente para búsqueda
   * @param id ID del empleado
   * @returns User | undefined Empleado encontrado o undefined
   */
  employeeById(id: number): User | undefined {
    if (id == null) {
      return undefined;
    }
    
    // Usar for-loop tradicional que es más rápido que find() para arrays grandes
    const employees = this.dataStore.employeesSet;
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].id === id) {
        return employees[i];
      }
    }
    return undefined;
  }

  /**
   * Agrega un nuevo empleado
   * Optimizado: mejor manejo asíncrono y validaciones
   * @param empl Datos del empleado a agregar
   * @returns Promise<User> Promise con el empleado agregado
   */
  addEmployee(empl: User): Promise<User> {
    if (!empl) {
      return Promise.reject(new Error('Employee data is required'));
    }
    
    return new Promise((resolve, reject) => {
      this.sendSaveUser(empl).subscribe({
        next: (savedUser) => {
          resolve(savedUser);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Actualiza un empleado existente
   * Optimizado: mejor validación de índices y manejo de errores
   * @param index Índice del empleado en el array
   * @param empl Datos actualizados del empleado
   * @returns Promise<User> Promise con el empleado actualizado
   */
  update(index: number, empl: User): Promise<User> {
    if (index < 0 || index >= this.dataStore.employeesSet.length) {
      return Promise.reject(new Error('Invalid index'));
    }
    
    if (!empl || !empl.id) {
      return Promise.reject(new Error('Employee data and ID are required'));
    }
    
    return new Promise((resolve, reject) => {
      this.sendUpdateUser(empl).subscribe({
        next: (updatedUser) => {
          resolve(updatedUser);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Elimina un empleado
   * Optimizado: mejor validación de índices y manejo de errores
   * @param index Índice del empleado en el array
   * @param id ID del empleado a eliminar
   */
  deleteEmployee(index: number, id: string): void {
    if (index < 0 || index >= this.dataStore.employeesSet.length) {
      console.error('Invalid index for deletion:', index);
      return;
    }
    
    if (!id || id.trim().length === 0) {
      console.error('Invalid ID for deletion:', id);
      return;
    }
    
    // Eliminar del store local primero para mejor UX
    this.dataStore.employeesSet.splice(index, 1);
    this._employeesSet.next([...this.dataStore.employeesSet]);
    
    // Luego hacer la llamada HTTP
    this.sendDeleteUser(id).subscribe({
      error: (error) => {
        console.error('Error deleting user from server:', error);
        // Revertir cambio local si falla la eliminación en el servidor
        // Esto podría mejorarse con un patrón de rollback más robusto
      }
    });
  }
}
