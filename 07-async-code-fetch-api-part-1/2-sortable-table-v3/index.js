import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = false,
    url = null,
    offset = 30,
  } = {}) {
    super(headersConfig, { data, sorted, isSortLocally, offset, url: new URL(url, BACKEND_URL) });
  }

  async sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      await this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  }

  sortOnClient(id, order) {
    super.sortOnClient(id, order);
  }

  async sortOnServer(id, order) {
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);

    const response = await this.fetchData(0, this.offset);

    this.data = response;

    this.subElements.body.innerHTML = this.getTbodyContent(this.data);
  }

  async fetchData(start, end) {
    this.loading = true;

    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    const response = await fetchJson(this.url);

    this.loading = false;

    this.addSortableTableScrollEventListener();

    return response;
  }

  async render() {
    if (this.isSortLocally) {

      const response = await this.fetchData(0, this.offset);
  
      this.data = response;
  
      this.subElements.body.innerHTML = this.getTbodyContent(this.data);
    }
    
    await this.sort();
  }

  addSortableTableScrollEventListener() {
    window.addEventListener('scroll', this.onSortableTableScroll);
  }

  removeSortableTableScrollEventListener() {
    window.removeEventListener('scroll', this.onSortableTableScroll);
  }

  onSortableTableScroll = async () => {
    if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight) {
      return;
    }

    const response = await this.fetchData(this.data.length, this.data.length + this.offset);

    if (!response?.length) {
      this.removeSortableTableScrollEventListener();
      return;
    }

    this.data = this.data.concat(response);

    this.getTbodyContent(response).forEach(item => this.subElements.body.appendChild(item.element));
  }

  destroy() {
    super.destroy();

    this.removeSortableTableScrollEventListener();
  }
}
