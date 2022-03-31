import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { Piece } from '../piece/piece';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {
  iPieces: Piece[];
  iParts: number;
  iImageSize = { height: '', width: '' };
  iHaveWon = false;
  iDifficulties = [3, 4, 5, 6, 7, 8];
  iSubscription$: any;
  iAutoPlaying = false;
  constructor(private iStateService: StateService) { }

  ngOnInit(): void {
    this.iStateService.iDimension$.subscribe(mDimension => this.iParts = mDimension);
    this.iStateService.iPieces$.subscribe(mPieces => this.iPieces = mPieces);
    this.iStateService.iImageSize$.subscribe(mSize => {
      this.iImageSize.width = '500px';
      this.iImageSize.height = '500px';
    })
  }

  pieceClicked(pPiece: Piece) {
    if (this.iStateService.canMove(pPiece.x, pPiece.y)) {
      const { x, y } = this.iStateService.movePiece(pPiece);
      const mPiece = this.iPieces.find(p => pPiece.id === p.id);
      mPiece.x = x;
      mPiece.y = y;
      if (this.iStateService.isCompleted()) {
        this.iHaveWon = true;
        this.iSubscription$?.unsubscribe();
      }
    }
  }

  updatePuzzle(pValue) {
    this.iStateService.initializePuzzle(parseInt(pValue));
  }

  wonPuzzle() {
    this.iHaveWon = false;
    this.updatePuzzle(4);
  }

  imgLoaded(pInput: HTMLInputElement) {
    this.iStateService.iImage$.next(URL.createObjectURL(pInput.files[0]));
  }

  getRandomImage() {
    this.iStateService.getRandomImage();
  }

  solve() {
    if (!this.iAutoPlaying) {
      this.iAutoPlaying = true;
      this.iSubscription$ = interval(200).subscribe(() => {
        if (this.iHaveWon) {
          this.iSubscription$.unsubscribe();
        } else {
          const mAvailableMoves = this.iPieces.filter(p => this.iStateService.canMove(p.x, p.y));
          const mRandomPiece = mAvailableMoves[Math.floor(Math.random() * mAvailableMoves.length)];
          const { x, y } = this.iStateService.movePiece(mRandomPiece);
          const mPiece = this.iPieces.find(p => mRandomPiece.id === p.id);
          mPiece.x = x;
          mPiece.y = y;
        }
      });
    } else {
      this.iAutoPlaying = false;
      this.iSubscription$.unsubscribe();
    }
  }
}
