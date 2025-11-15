import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { User } from '../models/users';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Unit tests for EmployeeService using Jest.
 * Optimizado con mejores prácticas y cobertura completa.
 */
describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://arsene.azurewebsites.net/User';

  const mockUsers: User[] = [
    { id: 1, nombre: 'John', apellido: 'Doe', email: 'john@example.com', profesion: 'Developer' },
    { id: 2, nombre: 'Jane', apellido: 'Smith', email: 'jane@example.com', profesion: 'Designer' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verificar que no hay requests pendientes
  });

  describe('getJSON', () => {
    it('should fetch users successfully', (done) => {
      // Act
      service.getJSON().subscribe({
        next: (users) => {
          // Assert
          expect(users).toEqual(mockUsers);
          expect(users.length).toBe(2);
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle HTTP errors', (done) => {
      const errorMessage = 'Server error';

      // Act
      service.getJSON().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toContain('Unable to fetch users set!');
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(API_URL);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });

    it('should handle null response', (done) => {
      // Act
      service.getJSON().subscribe({
        next: (users) => {
          // Assert
          expect(users).toEqual([]);
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(API_URL);
      req.flush(null);
    });
  });

  describe('sendDeleteUser', () => {
    it('should delete user successfully', (done) => {
      const userId = '1';

      // Act
      service.sendDeleteUser(userId).subscribe({
        next: () => {
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${API_URL}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle empty ID', (done) => {
      // Act
      service.sendDeleteUser('').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('ID cannot be null or empty');
          done();
        }
      });

      // No HTTP request should be made
      httpMock.expectNone(`${API_URL}/`);
    });

    it('should handle delete errors', (done) => {
      const userId = '999';

      // Act
      service.sendDeleteUser(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Unable to delete user');
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${API_URL}/${userId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('sendSaveUser', () => {
    it('should save user successfully', (done) => {
      const newUser: User = {
        id: 3,
        nombre: 'Bob',
        apellido: 'Johnson',
        email: 'bob@example.com',
        profesion: 'Manager'
      };

      // Act
      service.sendSaveUser(newUser).subscribe({
        next: (user) => {
          // Assert
          expect(user).toEqual(newUser);
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(newUser);
    });

    it('should handle null user data', (done) => {
      // Act
      service.sendSaveUser(null as any).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('User data is required');
          done();
        }
      });

      // No HTTP request should be made
      httpMock.expectNone(API_URL);
    });

    it('should handle save errors', (done) => {
      const newUser: User = {
        id: 3,
        nombre: 'Bob',
        apellido: 'Johnson',
        email: 'bob@example.com',
        profesion: 'Manager'
      };

      // Act
      service.sendSaveUser(newUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Unable to save user');
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(API_URL);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('sendUpdateUser', () => {
    it('should update user successfully', (done) => {
      const updatedUser: User = {
        id: 1,
        nombre: 'John',
        apellido: 'Updated',
        email: 'john.updated@example.com',
        profesion: 'Senior Developer'
      };

      // Act
      service.sendUpdateUser(updatedUser).subscribe({
        next: (user) => {
          // Assert
          expect(user).toEqual(updatedUser);
          done();
        }
      });

      // Assert HTTP request
      const req = httpMock.expectOne(`${API_URL}/${updatedUser.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    it('should handle user without ID', (done) => {
      const userWithoutId: User = {
        id: undefined,
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        profesion: 'Test'
      };

      // Act
      service.sendUpdateUser(userWithoutId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('User data and ID are required');
          done();
        }
      });

      // No HTTP request should be made
      httpMock.expectNone(`${API_URL}/undefined`);
    });
  });

  describe('employeeById', () => {
    it('should find employee by ID', () => {
      // Arrange - populate store
      service.getJSON().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockUsers);

      // Act
      const employee = service.employeeById(1);

      // Assert
      expect(employee).toBeDefined();
      expect(employee?.id).toBe(1);
      expect(employee?.nombre).toBe('John');
    });

    it('should return undefined for non-existent ID', () => {
      // Arrange - populate store
      service.getJSON().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockUsers);

      // Act
      const employee = service.employeeById(999);

      // Assert
      expect(employee).toBeUndefined();
    });

    it('should return undefined for null ID', () => {
      // Act
      const employee = service.employeeById(null as any);

      // Assert
      expect(employee).toBeUndefined();
    });
  });

  describe('addEmployee', () => {
    it('should add employee successfully', async () => {
      const newUser: User = {
        id: undefined,
        nombre: 'New',
        apellido: 'Employee',
        email: 'new@example.com',
        profesion: 'Junior Developer'
      };

      // Act
      const promise = service.addEmployee(newUser);

      // Assert HTTP request
      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      req.flush({ ...newUser, id: 3 });

      // Wait for promise
      const result = await promise;
      expect(result.id).toBe(3);
    });

    it('should reject when user data is null', async () => {
      // Act & Assert
      await expect(service.addEmployee(null as any)).rejects.toThrow('Employee data is required');
    });
  });

  describe('update', () => {
    it('should update employee successfully', async () => {
      // Arrange - populate store
      service.getJSON().subscribe();
      const req1 = httpMock.expectOne(API_URL);
      req1.flush(mockUsers);

      const updatedUser: User = {
        id: 1,
        nombre: 'John',
        apellido: 'Updated',
        email: 'john.updated@example.com',
        profesion: 'Senior Developer'
      };

      // Act
      const promise = service.update(0, updatedUser);

      // Assert HTTP request
      const req2 = httpMock.expectOne(`${API_URL}/${updatedUser.id}`);
      expect(req2.request.method).toBe('PUT');
      req2.flush(updatedUser);

      // Wait for promise
      const result = await promise;
      expect(result).toEqual(updatedUser);
    });

    it('should reject for invalid index', async () => {
      // Act & Assert
      const user: User = { id: 1, nombre: 'Test', apellido: 'User', email: 'test@example.com', profesion: 'Test' };
      await expect(service.update(-1, user)).rejects.toThrow('Invalid index');
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee successfully', () => {
      // Arrange - populate store
      service.getJSON().subscribe();
      const req1 = httpMock.expectOne(API_URL);
      req1.flush(mockUsers);

      // Act
      service.deleteEmployee(0, '1');

      // Assert HTTP request
      const req2 = httpMock.expectOne(`${API_URL}/1`);
      expect(req2.request.method).toBe('DELETE');
      req2.flush({});
    });

    it('should handle invalid index gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      service.deleteEmployee(-1, '1');

      // Assert - no HTTP request should be made
      httpMock.expectNone(`${API_URL}/1`);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('employeesSet observable', () => {
    it('should emit employees when store is updated', (done) => {
      // Act
      service.employeesSet.subscribe({
        next: (employees) => {
          if (employees.length > 0) {
            expect(employees.length).toBeGreaterThan(0);
            done();
          }
        }
      });

      // Trigger update
      service.getJSON().subscribe();
      const req = httpMock.expectOne(API_URL);
      req.flush(mockUsers);
    });
  });
});

