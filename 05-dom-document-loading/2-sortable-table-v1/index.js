class BaseComponent {
  render(container = document.body) {
    container.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  toString() {
    return this.element.outerHTML;
  }
}

export default class SortableTable extends BaseComponent {
  #element;
  subElements;

  #loading = false;
  #data = [];

  set element(value) {
    this.#element = value;
    this.subElements = {
      header: this.#element.querySelector('.sortable-table__header'),
      body: this.#element.querySelector('.sortable-table__body'),
      loadingLine: this.#element.querySelector('.sortable-table__loading-line'),
      emptyPlaceholder: this.#element.querySelector('.sortable-table__empty-placeholder'),
    };
  }

  get element() {
    return this.#element;
  }

  set data(value) {
    this.#data = value;
    if (!this.subElements?.emptyPlaceholder) {
      return;
    }
    if (!this.#data?.length && !this.loading) {
      this.subElements.emptyPlaceholder.style.display = 'block';
    } else {
      this.subElements.emptyPlaceholder.style.display = 'none';
    }
  }

  get data() {
    return this.#data;
  }

  set loading(value) {
    this.#loading = value;

    if (!this.subElements?.loadingLine) {
      return;
    }

    if (this.#loading) {
      this.subElements.loadingLine.style.display = 'block';
    } else {
      this.subElements.loadingLine.style.display = 'none';
    }
  }

  get loading() {
    return this.#loading;
  }

  constructor(headerConfig = [], data = [], enableSort = false) {
    super();

    this.headerConfig = headerConfig;
    this.data = data;
    this.enableSort = enableSort;

    this.theadContent = this.getTheadContent(headerConfig);
    this.tbodyContent = this.getTbodyContent(data);
    
    this.element = this.createElement();
  }

  createElement() {
    return Object.assign(document.createElement('div'), {
      className: 'sortable-table',
      innerHTML: this.template(),
    });
  }

  template() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.theadContent.join('\n')}
      </div>
      <div data-element="body" class="sortable-table__body">
        ${this.tbodyContent.join('\n')}
      </div>

      <div data-element="loading" class="loading-line sortable-table__loading-line" style="display: ${this.loading ? 'block' : 'none'}"></div>

      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder" style="display: ${this.data?.length ? 'none' : 'block'}">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  sort(fieldValue, orderValue) {
    const index = this.theadContent.findIndex((cell) => cell.id === fieldValue);
    if (~index) {
      const sortType = this.theadContent[index].sortType;
      const options = 'ru-u-kf-upper';
      this.tbodyContent = orderValue === 'asc'
        ? this.tbodyContent.sort((a, b) =>
            sortType === 'string'
              ? a.children[index].title.localeCompare(b.children[index].title, options)
              : a.children[index].title - b.children[index].title
          )
        : this.tbodyContent.sort((a, b) =>
          sortType === 'string'
            ? b.children[index].title.localeCompare(a.children[index].title, options)
            : b.children[index].title - a.children[index].title
        );
      this.subElements.body.innerHTML = this.tbodyContent.join('\n');
    }
  }

  getTheadContent(data) {
    return data.map(item => 
      new SortableTableHeaderCell({ ...item, template: null, enableSort: this.enableSort })
    );
  }

  getTbodyContent(data) {
    return data.map(item =>
      new SortableTableRow({
        ...item,
        href: '#',
        children: this.headerConfig.map(
          cell => new SortableTableCell({ title: item[cell.id], template: cell.template?.bind(null, item.images) })
        )
      })
    );
  }
}


class SortableTableRow extends BaseComponent {
  #children = [];

  set children(data) {
    this.#children = Array.isArray ? data : [];
  }

  get children() {
    return this.#children;
  }

  constructor (data) {
    super();

    this.href = data.href;
    this.children = data.children;

    this.element = this.createElement();
  }

  createElement() {
    const element = Object.assign(document.createElement('template'), {
      innerHTML: this.template(),
    }).content.firstElementChild;
    
    this.children.forEach(child => element.appendChild(child.element));

    return element;
  }

  template() {
    return `
      <a href="${this.href}" class="sortable-table__row"></a>
    `;
  }
}

class SortableTableCell extends BaseComponent {
  constructor (data) {
    super();

    this.title = data?.title ?? '';

    this.template = data?.template ?? this.template;

    this.element = this.createElement();
  }

  createElement() {
    return Object.assign(document.createElement('template'), {
      innerHTML: this.template(),
    }).content.firstElementChild;
  }
  
  template() {
    return `
      <div class="sortable-table__cell">${this.title}</div>
    `;
  }
}

class SortableTableHeaderCell extends SortableTableCell {
  constructor(data) {
    super(data);

    this.id = data?.id ?? '';
    this.sortType = data?.sortType ?? 'string';
    this.sortable = data?.sortable ?? false;
    this.order = data?.order || 'asc';
    this.enableSort = data?.enableSort || false;

    this.element = this.createElement();
  }

  template() {
    return `
      <div class="sortable-table__cell" data-id="${this.id}" data-sortable="${this.sortable}" ${this.enableSort ? `data-order="${this.order}"` : ''}>
        <span>${this.title}</span>
        ${this.sortable
          ? ` <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>`
          : ''
        }
      </div>
    `;
  }
}
