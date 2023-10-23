import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true,
    url = null,
    offset = 30,
  } = {}) {
    super(headersConfig, data, true);

    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.url = url;
    this.offset = offset;

    this.sort();

    this.addEventListeners();
  }

  sort () {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(id = this.sorted.id, order = this.sorted.order) {
    super.sort(id, order);
  }

  sortOnServer() {

  }

  setSort(fieldValue, orderValue) {
    this.sorted.id = fieldValue ?? this.sorted.id;
    this.sorted.order = orderValue ?? this.sorted.order;
  }

  addEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellPointerdown);
  }

  removeEventListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellPointerdown);
  }

  handleHeaderCellPointerdown = (event) => {
    const cell = event.target.closest('.sortable-table__cell');

    if (!cell) {
      return;
    }

    const fieldValue = cell.getAttribute('data-id');
    const orderValue = cell.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
    const sortableValue = cell.getAttribute('data-sortable');

    if (sortableValue && JSON.parse(sortableValue)) {
      cell.setAttribute('data-order', orderValue);

      this.setSort(fieldValue, orderValue);
  
      this.sort(this.sorted.id, this.sorted.order);
    }
  }

  destroy() {
    this.remove();

    this.removeEventListeners();
  }
}
