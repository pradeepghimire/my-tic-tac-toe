import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { SoloBoardComponent } from './board/solo-board/solo-board.component';
import { TwoBoardComponent } from './board/two-board/two-board.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SoloBoardComponent,
    TwoBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
