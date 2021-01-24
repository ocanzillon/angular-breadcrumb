import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../../model/user.model';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private readonly http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users`).subscribe(users => this.users = users);
  }

}
