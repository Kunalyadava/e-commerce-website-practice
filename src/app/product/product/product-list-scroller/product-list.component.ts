import { Component, ElementRef, OnInit, TrackByFunction, ViewChild, computed, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AddProductComponent } from '../add-product/add-product.component';
import { CommonserviceService } from '../../../commonservice.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavComponent } from '../../../nav/nav.component';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadingDirective } from '../../lazy-loading.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatToolbarModule, NavComponent, LazyLoadingDirective, CommonModule, MatIconModule, TranslateModule, MatProgressSpinnerModule,RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponentscoller implements OnInit {
  displayedColumns: string[] = ['serialNumber', 'id', 'name', 'description', 'price', 'quantity', 'action'];
  dataSource: MatTableDataSource<[]> = new MatTableDataSource<[]>([]);
  private defaultValue = 30;
  private dummyDataSignal = signal<[]>([]);
  private limitSignal = signal<number>(this.defaultValue);
  loading = false
  allDataLoaded = false;
  destroy$ = new Subject<void>();
  constructor(public dialog: MatDialog, private http: CommonserviceService) { }

  ngOnInit(): void {
    this.setUserData();
  }

  setUserData(): void {
    this.loading = true;
    this.http.getuser().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.dummyDataSignal.set(res);
        this.limitSignal.set(this.defaultValue);
        this.updateDataSource();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }


  updateDataSource(): void {
    const data = this.dummyDataSignal().slice(0, this.limitSignal());
    this.dataSource = new MatTableDataSource<[]>(data);
  }
  openAddEditdeleteDialog(): void {
    const dialogRef = this.dialog.open(AddProductComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.setUserData();
      }
    });
  }
  EditDialog(data: []): void {
    const dialogRef = this.dialog.open(AddProductComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      this.setUserData();
    });
  }

  deleteUser(id: number): void {
    const confirmation = window.confirm("Are you sure you want to delete this employee?");
    if (confirmation) {
      this.http.deleteuser(id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.setUserData();
      });
    }
  }

  onReset(): void {
    this.limitSignal.set(this.defaultValue);
    window.scrollTo(0, 0);
  }

  onNearEndScroll(): void {
    this.limitSignal.update((val) => val + this.defaultValue);
    this.updateDataSource();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
