import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: {'class': 'search-box'}
})
export class SearchComponent implements OnInit {

  constructor() { }

  @Output() onSearch = new EventEmitter<string>();

  ngOnInit(): void {
  }

}
