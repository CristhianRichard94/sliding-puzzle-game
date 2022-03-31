import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Piece } from '../piece/piece';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class StateService {
  iDimension$ = new BehaviorSubject(0);
  iImageSize$ = new BehaviorSubject({ height: '', width: '' });
  iFreePlace$ = new BehaviorSubject({ x: 0, y: 0 });
  iPieces$: BehaviorSubject<Piece[]> = new BehaviorSubject([]);
  iImage$ = new BehaviorSubject('../assets/monks.jpg');
  constructor(private iHttpClient: HttpClient) {
    this.initializePuzzle();
  }

  initializePuzzle(pDimension = 4): void {
    this.iDimension$.next(pDimension);
    let mPieces = new Array(0),
      mId = 1;
    for (let rowIndex = 1; rowIndex <= pDimension; rowIndex++) {
      for (let colIndex = 1; colIndex <= pDimension; colIndex++) {
        mPieces.push(new Piece(
          mId,
          colIndex,
          rowIndex,
          colIndex,
          rowIndex,
        ))
        mId++;
      }
    }
    mPieces = this.shuffle(mPieces);
    console.log(mPieces);
    // remove one piece
    const { x, y } = mPieces.pop();
    this.iFreePlace$.next({ x, y });
    this.iPieces$.next(mPieces);
  }

  shuffle(pArray: Piece[]): Piece[] {
    for (let index = 0; index < 50; index++) {

      let mRandom1 = pArray[Math.floor(Math.random() * pArray.length)],
        mRandom2 = pArray[Math.floor(Math.random() * pArray.length)],
        { x, y } = mRandom2;
      pArray[pArray.indexOf(mRandom2)].y = mRandom1.y;
      pArray[pArray.indexOf(mRandom2)].x = mRandom1.x;
      pArray[pArray.indexOf(mRandom1)].x = x;
      pArray[pArray.indexOf(mRandom1)].y = y;

    }
    return pArray
  }


  movePiece(pPiece: Piece): { x: number, y: number } {
    const { x, y } = this.iFreePlace$.value;
    this.iFreePlace$.next({ x: pPiece.x, y: pPiece.y });
    return { x, y };
    // this.iPieces$.next(
    //   this.iPieces$.value.map(p => p.id === pPiece.id ? { ...p, x, y } : p));
  }

  canMove(x: number, y: number): boolean {
    let mCanMove = false, mFreePlace = this.iFreePlace$.value;
    if (x === mFreePlace.x) {
      if (y + 1 === mFreePlace.y || y - 1 === mFreePlace.y) {
        mCanMove = true
      }
    } else {
      if (y === mFreePlace.y) {
        if (x + 1 === mFreePlace.x || x - 1 === mFreePlace.x) {
          mCanMove = true
        }
      }
    }
    return mCanMove;
  }


  isCompleted(): boolean {
    return this.iPieces$.value.every(p => p.x == p.x0 && p.y === p.y0);
  }

  getRandomImage() {
    this.iHttpClient.get('https://source.unsplash.com/random', { responseType: 'blob' }).subscribe(mImage => {
      this.iImage$.next(URL.createObjectURL(mImage));
    });
  }
}

