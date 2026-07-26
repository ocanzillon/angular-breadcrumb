import { Component, inject, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { take } from "rxjs";
import { User } from '../../model/user.model';
import { UserService } from "../../service/user.service";


@Component({
  selector: 'app-user-list',
  imports: [
    RouterModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  private readonly userService = inject(UserService);
  users = signal<User[]>([]);

  constructor() {
    this.userService.getUsers()
      .pipe(take(1))
      .subscribe(this.users.set);
  }

}
