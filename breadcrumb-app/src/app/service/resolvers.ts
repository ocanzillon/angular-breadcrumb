import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { User } from "../model/user.model";
import { UserService } from "./user.service";

export const userResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id')!;
  return userService.getUser(id);
};
