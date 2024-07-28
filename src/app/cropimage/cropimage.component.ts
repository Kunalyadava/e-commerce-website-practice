import { Component, OnInit, SecurityContext } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonserviceService } from '../commonservice.service';
import { NavComponent } from '../nav/nav.component';
import { RouterModule } from '@angular/router';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ImageToDirectiveDirective } from '../imagedirective/image-to-directive.directive';
export interface userProfiledata {
  avatar: string
}
@Component({
  selector: 'app-cropimage',
  standalone: true,
  imports: [ImageCropperModule, NavComponent, RouterModule, TranslateModule, ImageToDirectiveDirective],
  templateUrl: './cropimage.component.html',
  styleUrl: './cropimage.component.scss'
})
export class CropimageComponent implements OnInit {
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl | null = null;
  userId: string = ""
  userProfileData: userProfiledata | null = null
  destroy$ = new Subject<void>();
  constructor(
    private sanitizer: DomSanitizer, private http: CommonserviceService
  ) {
    this.userId = localStorage.getItem('userId') || '';
  }
  ngOnInit(): void {
    this.getprofilephoto()
  }
  getprofilephoto() {
    this.http.getUserData(this.userId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.userProfileData = res?.avatar
    })
  }
  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || '');

  }

  imageLoaded(image: LoadedImage) { }
  cropperReady() { }
  loadImageFailed() { }


  updateAvatar() {
    if (this.croppedImage) {
      const url = this.sanitizer.sanitize(SecurityContext.URL, this.croppedImage);
      if (url) {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            // Convert Blob to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                const base64Data = reader.result.split(',')[1];
                const avatarData = {
                  avatar: base64Data
                };
                this.http.getUserData(this.userId).pipe(
                  take(1),
                  switchMap(userData => {
                    const updatedUserData = { ...userData, ...avatarData };
                    return this.http.updateUserData(+this.userId, updatedUserData);
                  })
                ).subscribe((res) => {
                  if (res && res.avatar) {
                    this.userProfileData = { ...this.userProfileData, avatar: res.avatar };
                  } else {
                    console.error('Failed to update avatar.');
                  }
                });
              } else {
                console.error('Failed to read the cropped image.');
              }
            };
            reader.readAsDataURL(blob);
          })
          .catch(error => {
            console.error('Failed to fetch image:', error);
          });
      } else {
        console.error('Failed to extract URL from SafeUrl.');
      }
    } else {
      console.error('No cropped image available.');
    }
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

