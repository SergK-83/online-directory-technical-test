import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  host: {'class': 'pagination-wrap'},
})
export class PaginationComponent implements OnInit {

  @Input() totalCount: number;
  @Input() pagination: {perPage: number, pageNumber: number};
  @Output() changePagination = new EventEmitter<{perPage: number, pageNumber: number}>();
  perPageOptions = [
    5, 10, 15, 20, 25, 30
  ];

  get pagesCount(): number {
    let pagesCount = this.totalCount / this.pagination.perPage;
    if (this.totalCount % this.pagination.perPage) {
      pagesCount++;
    }
    return pagesCount;
  }

  get pageNumbers(): number[] {
    return Array.from({length: this.pagesCount}, (_, i) => i + 1);
  }

  get isFirst() {
    return this.pagination.pageNumber == 1;
  }

  get isLast() {
    return this.pagination.pageNumber >= this.pagesCount - 1;
  }

  constructor() { }

  ngOnInit(): void {
  }

  paginateRight() {
    if (this.isLast) {
      return;
    }
    this.pagination.pageNumber++;
    this.changePagination.emit(this.pagination);
  }

  paginateLeft() {
    if (this.isFirst) {
      return;
    }
    this.pagination.pageNumber--;
    this.changePagination.emit(this.pagination);
  }

  paginate(pageNumber: number) {
    this.pagination.pageNumber = pageNumber;
    this.changePagination.emit(this.pagination);
  }

  setPerPage(value: any) {
    this.pagination.perPage = value;
    this.pagination.pageNumber = 1;
    this.changePagination.emit(this.pagination);
  }
}
