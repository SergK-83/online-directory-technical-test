import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../models/user";
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  host: {'class': 'workspace__view'},
})
export class UsersListComponent implements OnInit {
  allUsers: User[] = [];
  showSearchBar: boolean;
  private searchString: string = '';

  constructor(private route: ActivatedRoute, private usersService: UsersService) {
    route.data.pipe(take(1)).subscribe(data => {
      this.showSearchBar = data.showSearchBar;
    });
  }

  ngOnInit(): void {
    this.usersService.getUsers().then(users => {
      if (!this.showSearchBar) {
        this.users = users.filter(u => u.is_favorite);
      } else {
        this.users = users;
      }
    });
  }

  set users(users: User[]) {
    if (this.allUsers.length != users.length) {
      this.pagination = {
        pageNumber: 1,
        perPage: 15,
      };
    }
    this.allUsers = users;
  }

  get countOfUsersCanBeDisplayed() {
    if (this.searchString.length > 0) {
      const searchRegexp = new RegExp(this.searchString, "i");
      return this.allUsers.filter(user => {
        return user.first_name.match(searchRegexp) ||
          user.last_name.match(searchRegexp) ||
          user.company_name.match(searchRegexp) ||
          user.email.match(searchRegexp) ||
          user.phone_number.match(searchRegexp);
      }).length;
    }
    return this.allUsers.length;
  }

  get displayedUsers(): User[] {
    let result = [] as User[];
    if (this.searchString.length > 0) {
      const searchRegexp = new RegExp(this.searchString, "i");
      result = this.allUsers.filter(user => {
        return user.first_name.match(searchRegexp) ||
          user.last_name.match(searchRegexp) ||
          user.company_name.match(searchRegexp) ||
          user.email.match(searchRegexp) ||
          user.phone_number.match(searchRegexp);
      });
    } else {
      result = [...this.allUsers];
    }

    const paginationFrom = (this.pagination.pageNumber - 1) * this.pagination.perPage;
    const paginationTo = paginationFrom + this.pagination.perPage;
    result = result.slice(paginationFrom, paginationTo);
    if (!this.showSearchBar) {
      result = result.filter(u => u.is_favorite);
    }

    return result;
  }

  fields = ['first_name', 'last_name', 'email', 'phone', 'company_name'];
  fieldTranslations = {
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'email': 'Email',
    'phone': 'Phone',
    'company_name': 'Company',
  }

  set pagination(newPagination) {
    this._pagination = newPagination;
  }

  get pagination() {
    return this._pagination;
  }

  private _pagination = {
    perPage: 15,
    pageNumber: 1,
  };

  toggleFavorite(user: User) {
    user.is_favorite = !user.is_favorite;
    this.updateUser(user);
  }

  onSearch(searchString: string) {
    if (this.searchString != searchString) {
      this.pagination.pageNumber = 1;
    }
    this.searchString = searchString;
  }

  updateUser(user: User) {
    this.usersService.setFavorite(user.id, user.is_favorite);
  }

}
