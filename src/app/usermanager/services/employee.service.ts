import { Injectable } from '@angular/core';
import { User } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
   private readonly URL = 'http://arsene.azurewebsites.net/User';
   private _employeesSet: BehaviorSubject<User[]>;

  private dataStore: {
     employeesSet: User[]
  }

  //this will allow components to subscribe to this behavior subject
  constructor(private http: HttpClient) { 
    this.dataStore = { employeesSet:[] };
    this._employeesSet = new BehaviorSubject<User[]>([]);
  }


  get employeesSet(): Observable<User[]>{
    return this._employeesSet.asObservable();
  }

  sendDeleteUser(id : string){
    return this.http.delete<User>(this.URL+'/'+id).subscribe(
      res => {
        console.log(res);
      }
    );
  }
 
  getJSON() {
    return this.http.get<User[]>(this.URL)
    .subscribe(data =>{
          this.dataStore.employeesSet = data;
          this._employeesSet.next(Object.assign({}, this.dataStore).employeesSet);
      }), catchError(error => {
          return throwError('Unable to fetch users set!');
});

}
sendUpdateUser(data: User): Observable<any> {
  return this.http.put<User>(this.URL+'/'+data.id, data);
}

sendSaveUser(data: User): Observable<any> {
      return this.http.post<User>(this.URL, data);
  }

employeeById(id : number){
  return this.dataStore.employeesSet.find(x=>x.id == id);
}

  addEmployee(empl:User): Promise<User>{
    this.sendSaveUser(empl).subscribe(
      res => {
        console.log(res);
      }
    );
    return new Promise((resolver,reject) =>{
      empl.id = this.dataStore.employeesSet.length + 1;
      this.dataStore.employeesSet.push(empl);
      this._employeesSet.next(Object.assign({}, this.dataStore).employeesSet);
      resolver(empl);
    });
  }

update(index:number, empl: User): Promise<User> {
    this.sendUpdateUser(empl).subscribe(
      res => {
        console.log(res);
      }
    );
    return new Promise((resolver,reject) =>{
          this.dataStore.employeesSet[index] = empl;
          this._employeesSet.next(Object.assign({}, this.dataStore).employeesSet);
          resolver(empl);      
    })
    
  }

  deleteEmployee(index:number,id:string){
    this.sendDeleteUser(id);
    this.dataStore.employeesSet.splice(index,1);
  }
}
