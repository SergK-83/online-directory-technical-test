import { Injectable } from '@angular/core';
import {instantiateAndValidateUserByJson, User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {FavoriteUsersStorageService} from "./favorite-users-storage.service";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient, private favUsersService: FavoriteUsersStorageService) { }

  readonly USERS_ENDPOINT = 'https://online-directory-test.herokuapp.com/users';

  private static cachedUsers: User[] = [];

  async getUsers(): Promise<User[]>
  {
    let users$: Observable<any>;
    if (UsersService.cachedUsers.length) {
      users$ = of(UsersService.cachedUsers);
    } else {
      users$ = this.httpClient.get(this.USERS_ENDPOINT);
    }
    return users$.pipe(
        map((body: Array<User>) => {
          return body.map(rawUser => {
            const is_favorite = this.favUsersService.getIsFavorite(rawUser['id']);
            return instantiateAndValidateUserByJson({...rawUser, is_favorite})
          })
        }),
        tap(users => {
          UsersService.cachedUsers = users;
          console.log('cached');
        }),
      )
      .toPromise();
  }

  setFavorite(id: number, is_favorite: boolean) {
    this.favUsersService.setIsFavorite(id, is_favorite);
    const idx = UsersService.cachedUsers.findIndex(u => u.id == id);
    UsersService.cachedUsers[idx].is_favorite = is_favorite;
  }
}
