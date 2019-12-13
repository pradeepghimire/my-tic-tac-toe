import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BoardComponent} from "./board/board.component";
import {SoloBoardComponent} from "./board/solo-board/solo-board.component";
import {TwoBoardComponent} from "./board/two-board/two-board.component";


const routes: Routes = [
  {path: '', redirectTo: '/board/solo', pathMatch: 'full'},
  {path: 'board', component: BoardComponent, children: [
      {path: 'solo', component: SoloBoardComponent},
      {path: 'two', component: TwoBoardComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
