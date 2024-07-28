import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AddProductComponent } from '../add-product/add-product.component';
import { CommonserviceService } from '../../../commonservice.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NavComponent } from '../../../nav/nav.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatToolbarModule, TranslateModule, CommonModule, MatIconModule,MatInputModule,NavComponent, MatPaginatorModule,MatFormFieldModule,RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  displayedColumns: string[] = ['serialNumber', 'id', 'name', 'description', 'price', 'quantity', 'action'];
  data: any[] | undefined
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator
  constructor(public dialog: MatDialog, private http: CommonserviceService) { }
  ngOnInit() {
    this.getuser()
  }
  getuser() {
    this.http.getuser().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.log(err);
      },
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openAddEditdeleteDialog() {
    const dialogRef = this.dialog.open(AddProductComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getuser()
    });
  }
  EditDialog(data: any) {
    const dialogRef = this.dialog.open(AddProductComponent, { data: data });

    dialogRef.afterClosed().subscribe(result => {
      this.getuser()
    });
  }
  deleteUser(id: number) {
    window.confirm("Are you sure you want to delete this employee?");
    if (true)
      this.http.deleteuser(id).subscribe((res: any) => {
        this.getuser()
      })
  }


  onPageChange(event: any) {
    if (!event.hasNextPage) {
      return;
    }
    const nextPage = event.pageIndex + 1;
    const pageSize = event.pageSize;
    const startIndex = event.pageIndex * event.pageSize + 1;
    this.http.getProducts(nextPage, pageSize).subscribe({
      next: (res: any) => {
        const newData = [...this.dataSource.data, ...res];
        this.dataSource.data = newData;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

}


