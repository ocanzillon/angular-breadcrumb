import { HttpClient } from "@angular/common/http";
import { inject, Service } from '@angular/core';
import { User } from "../model/user.model";

@Service()
export class UserService {

  private readonly http = inject(HttpClient);

  public getUsers() {
    return this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users`);
  }

  public getUser(id: string) {
    return this.http.get<User>(`https://jsonplaceholder.typicode.com/users/${id}`);
  }

}
