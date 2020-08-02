import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Observable } from 'rxjs';
import { User } from '../../models/users';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBarRef, SimpleSnackBar, MatSnackBar, MatDialogConfig } from '@angular/material';
import { EditEmployeeDialogComponent } from '../edit-employee-dialog/edit-employee-dialog.component';


@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  @Input() employeesData: Observable<User[]>;
  employee: User;
  constructor(private employeeService: EmployeeService,
     private router: Router,
     private route: ActivatedRoute,
     private dialog:MatDialog,
     private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.employeesData = this.employeeService.employeesSet;
    this.employeeService.getJSON();
    this.employeesData.subscribe(data =>{
      console.log(data);
    });
  }

  __cardClick(emp){
    console.log(emp);
    this.router.navigate(['employeemanager', emp.id]);
  }

  openEmployeeDialog(index:number,{ id, nombre,apellido,email,profesion}:User){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.data= { id, nombre,apellido,email,profesion};
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(
      val => console.log("Dialog output:", val)
  );
}

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
       duration: 2000,
     });
   }
   
   deleteItem(i:number,id:string){
    this.employeeService.deleteEmployee(i,id);
   }
}
