import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteUsersStorageService {

  private static favoriteUsersIds: Array<number> = [];
  readonly LocalStorageKey = 'favoriteUsers';

  constructor() {
    FavoriteUsersStorageService.favoriteUsersIds = [];
    try {
      const storageValue = JSON.parse(localStorage.getItem(this.LocalStorageKey));
      if (typeof storageValue !== 'object' || !storageValue.hasOwnProperty('length')) {
        throw new Error();
      }
      FavoriteUsersStorageService.favoriteUsersIds = storageValue;
    } catch (e) {
      FavoriteUsersStorageService.favoriteUsersIds = [];
    }
  }

  getIsFavorite(userId: number): boolean {
    return FavoriteUsersStorageService.favoriteUsersIds.find(id => id == userId) && true || false;
  }

  setIsFavorite(userId: number, isFavorite: boolean) {
    if (this.getIsFavorite(userId) == isFavorite) {
      return;
    }
    if (isFavorite) {
      FavoriteUsersStorageService.favoriteUsersIds.push(userId);
    } else {
      FavoriteUsersStorageService.favoriteUsersIds = [
        ...FavoriteUsersStorageService.favoriteUsersIds.filter(id => id != userId)
      ];
    }

    this.saveData();
  }

  private saveData()
  {
    const jsonData = JSON.stringify(FavoriteUsersStorageService.favoriteUsersIds);
    localStorage.setItem(this.LocalStorageKey, jsonData);
  }
}
