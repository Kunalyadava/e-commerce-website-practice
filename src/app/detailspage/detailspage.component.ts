import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddEditdeleteComponent } from '../add-editdelete/add-editdelete.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from '../commonservice.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { NavComponent } from '../nav/nav.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [ReactiveFormsModule, MatPaginatorModule, MatTableModule,
    MatToolbarModule, MatIconModule, MatButtonModule, MatFormFieldModule, 
    MatInputModule, CommonModule, MatNativeDateModule, NavComponent, TranslateModule],
  templateUrl: './detailspage.component.html',
  styleUrl: './detailspage.component.scss'
})
export class DetailspageComponent implements OnInit {
  // the columns that will be displayed in the employee details table
  displayedColumns: string[] = [
    'id',
    'avatar',
    'firstName',
    'lastName',
    'email',
    'action',
  ];
  data: any[] | undefined
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // dependency injection
  constructor(
    private dialog: MatDialog,
    private addeitService: CommonserviceService,
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  openAddEditDialog() {
    const dialogRef = this.dialog.open(AddEditdeleteComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
        }
      },
    });
  }

  getUserList() {
    this.addeitService.getUserList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  // for searching employees with firstname, lastname, gennder, etc
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(id: number) {
    let confirm = window.confirm("Are you sure you want to delete this employee?");
    if (confirm) {
      this.addeitService.deleteUser(id).subscribe({
        next: (res: any) => {
          this.getUserList();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(AddEditdeleteComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
        }
      }
    });
  }
}