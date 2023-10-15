import * as SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

SortableTableV1.SortableTableHeaderCell.prototype.template = function () {
  return `
    <div class="sortable-table__cell" data-id="${this.id}" data-sortable="${this.sortable}" data-order="${this.order}">
      <span>${this.title}</span>
      ${this.sortable
        ? ` <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>`
        : ''
      }
    </div>
  `;
};

export default class SortableTable extends SortableTableV1.default {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true,
  } = {}) {
    super(headersConfig, data);

    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.setEventListeners();

    this.sort();
  }

  sort () {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient() {
    return super.sort(this.sorted.id, this.sorted.order);
  }

  sortOnServer() {

  }

  setSort(fieldValue, orderValue) {
    this.sorted.id = fieldValue;
    this.sorted.order = orderValue;
  }

  setEventListeners(elements = this.subElements.header.children) {
    Array.from(elements).forEach((element) => {
      element.addEventListener('pointerdown', this.handleHeaderCellPointerdown);
      if (elements.children?.length) {
        setEventListeners(elements);
      }
    });
  }

  removeEventListeners(elements = this.subElements.header.children) {
    Array.from(elements).forEach((element) => {
      element.removeEventListener('pointerdown', this.handleHeaderCellPointerdown);
      if (elements.children?.length) {
        removeEventListeners(elements);
      }
    });
  }

  handleHeaderCellPointerdown = (event) => {
    const cell = event.target.closest('.sortable-table__cell');
    const fieldValue = cell.getAttribute('data-id');
    const orderValue = cell.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
  
    cell.setAttribute('data-order', orderValue);

    this.setSort(fieldValue, orderValue);

    this.sort();
  }

  destroy() {
    this.removeEventListeners();

    this.remove();
  }
}
