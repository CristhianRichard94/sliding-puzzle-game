import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Sanitizer,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StateService } from '../services/state.service';
import { Piece } from './piece';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
})
export class PieceComponent implements OnInit {
  @Input() iPiece: Piece;
  @ViewChild('image') iImage: ElementRef<HTMLImageElement>;

  iParts: number;
  iImagePosition = { top: '', left: '' };
  iCanMove: boolean;
  iImageSource = '';
  constructor(
    private iStateService: StateService
  ) // private iSanitizer: DomSanitizer
  {}

  ngOnInit(): void {
    this.iStateService.iDimension$.subscribe((mDimension) => {
      this.iParts = mDimension;
      if (this.iImage?.nativeElement) {
        this.imgLoad(this.iImage.nativeElement);
      }
    });
    this.iStateService.iFreePlace$.subscribe(
      () =>
        (this.iCanMove = this.iStateService.canMove(
          this.iPiece.x,
          this.iPiece.y
        ))
    );
    // this.iStateService.iImage$.subscribe(mImageSource => this.iImageSource = this.iSanitizer.bypassSecurityTrustResourceUrl(mImageSource) as string);
  }

  imgLoad(img: HTMLImageElement) {
    if (img?.getClientRects().length > 0) {
      const { width, height } = img?.getClientRects()[0];
      this.iStateService.iImageSize$.next({
        width: `${width}`,
        height: `${height}`,
      });

      this.iImagePosition.top = `${(1 - this.iPiece.y0) * 100}%`;
      this.iImagePosition.left = `${(1 - this.iPiece.x0) * 100}%`;
    }
  }
}
