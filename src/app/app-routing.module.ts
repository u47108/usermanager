import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path:'usermanager', loadChildren:'./usermanager/employeemanager.module#EmployeemanagerModule'},
  { path:'demo', loadChildren:'./demo/demo.module#DemoModule'},
  { path: '**', redirectTo: 'usermanager'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
