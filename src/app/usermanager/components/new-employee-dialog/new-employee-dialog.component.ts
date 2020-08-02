import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { User } from '../../models/users';
import { FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-new-employee-dialog',
  templateUrl: './new-employee-dialog.component.html',
  styleUrls: ['./new-employee-dialog.component.scss']
})
export class NewEmployeeDialogComponent implements OnInit {

  employee:User;

  avatars = [
    'svg-1', 'svg-2', 'svg-3', 'svg-4'
  ]
  constructor(private dialogRef: MatDialogRef<NewEmployeeDialogComponent>,
              private employeeService: EmployeeService) { }

      
  ngOnInit() {
    this.employee = new User();
  }
  onSave(){
    this.employeeService.addEmployee(this.employee).then(emp=>{
      this.dialogRef.close(emp);
    });
    
  }
  onCancel(){
    this.dialogRef.close(null);
  }
}
