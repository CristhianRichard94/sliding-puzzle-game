import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { PieceComponent } from './piece/piece.component';

@NgModule({
  declarations: [
    AppComponent,
    PuzzleComponent,
    PieceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
