export default class ColumnChart {
    #element;
    subElements;

    chartHeight = 50;

    #loading = false;

    set element(value) {
        this.#element = value;
        this.subElements = {
            header: this.#element.querySelector('.column-chart__header'),
            body: this.#element.querySelector('.column-chart__chart'),
        };
    }

    get element() {
        return this.#element;
    }

    set loading(value) {
        this.#loading = value;
        if (this.#loading) {
            this.element.classList.add('column-chart_loading');
        } else {
            this.element.classList.remove('column-chart_loading');
        }
    }

    get loading() {
        return this.#loading;
    }

    constructor(config) {
        this.data = this.convertValuesToColumnData(config?.data);
        this.label = config?.label;
        this.value = config?.value;
        this.link = config?.link;
        this.formatHeading = config?.formatHeading;

        this.element = this.createElement();
    }

    createElement() {
        const element = document.createElement('div');

        element.className = this.data?.length ? 'column-chart' : 'column-chart column-chart_loading';
        element.innerHTML = this.template();
        element.style.setProperty('--chart-height', this.chartHeight);

        return element;
    }

    template() {
        return `
            <div class="column-chart__title">
                Total ${this.label}
                ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">
                    ${this.convertValueToFormatValue(this.value)}
                </div>
                <div data-element="body" class="column-chart__chart">
                    ${this.data?.length ? this.data.map(this.columnTemplate).join('\n') : ''}
                </div>
            </div>
        `;
    }

    columnTemplate(item) {
        return `
            <div style="--value: ${item.value}" data-tooltip="${item.percent}"></div>
        `;
    }

    update(values, total) {
        this.data = this.convertValuesToColumnData(values);

        this.subElements.header.innerHTML = this.convertValueToFormatValue(total);
        this.subElements.body.innerHTML = this.data?.length
            ? this.data.map(this.columnTemplate).join('\n')
            : '';
    }

    convertValueToFormatValue(value) {
        return this.formatHeading ? this.formatHeading(value) : value;
    }

    convertValuesToColumnData(values = []) {
        const maxValue = Math.max(...values);
        const scale = 50 / maxValue;
      
        return values.map(item => ({
            percent: (item / maxValue * 100).toFixed(0) + '%',
            value: String(Math.floor(item * scale)),
        }));
    }

    render(container = document.body) {
        container.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
