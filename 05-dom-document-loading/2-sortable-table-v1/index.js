export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.theadContent = headerConfig.map(item => 
      new SortableTableHeaderCell({ ...item, template: null })
    );
    this.tbodyContent = data.map(item =>
      Object.assign(new SortableTableRow({...item, href: '#'}), {
        children: headerConfig.map(
          cell => new SortableTableCell({ title: item[cell.id], template: cell.template?.bind(null, item.images) })
        )
      })
    );
    
    this.element = this.createElement();
    this.subElements.header = this.element.querySelector('.sortable-table__header');
    this.subElements.body = this.element.querySelector('.sortable-table__body');
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
      this.updateNode('.sortable-table__body', this.tbodyContent.join('\n'));
    }
  }

  updateNode(selector, innerHTML) {
    this.element.querySelector(selector).innerHTML = innerHTML;
    this.subElements.header = this.element.querySelector('.sortable-table__header');
    this.subElements.body = this.element.querySelector('.sortable-table__body');
  }

  render(container) {
    container.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}


class SortableTableRow {
  #children = [];

  constructor (data) {
    this.href = data.href;

    this.element = this.createElement();
  }

  set children(data) {
    this.#children = Array.isArray ? data : [];
  }

  get children() {
    return this.#children;
  }

  createElement() {
    return Object.assign(document.createElement('template'), {
      innerHTML: this.template(),
    }).content.firstElementChild;
  }

  template() {
    return `
      <a href="${this.href}" class="sortable-table__row"></a>
    `;
  }

  render(container) {
    container.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  toString() {
    return Object.assign(this.element.cloneNode(), {
      innerHTML: this.children.join('\n')
    }).outerHTML;
  }
}

class SortableTableCell {
  constructor (data) {
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

  render(container) {
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

export class SortableTableHeaderCell extends SortableTableCell {
  constructor(data) {
    super(data);

    this.id = data?.id ?? '';
    this.sortType = data?.sortType ?? 'string';
    this.sortable = data?.sortable ?? false;
    this.order = data?.order || 'asc';

    this.element = this.createElement();
  }

  template() {
    return `
      <div class="sortable-table__cell" data-id="${this.id}" data-sortable="${this.sortable}">
        <span>${this.title}</span>
      </div>
    `; 
  }
}
