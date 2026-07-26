import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from "./component/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    BreadcrumbComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('breadcrumb-app');
}
