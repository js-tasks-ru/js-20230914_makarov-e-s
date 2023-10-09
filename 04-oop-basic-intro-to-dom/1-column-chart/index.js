export default class ColumnChart {

    chartHeight = 50;

    constructor(config) {
        this.columnProps = this.getColumnProps(config?.data);
        this.label = config?.label;
        this.value = config?.value;
        this.link = config?.link;
        this.formatHeading = config?.formatHeading;

        this.element = this.createElement();
    }

    labelTemplate() {
        return `
            Total ${this.label}
        `;
    }

    linkTemplate() {
        return `
            ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
        `;
    }

    valueTemplate() {
        return `
            <div data-element="header" class="column-chart__header">
                ${this.formatHeading ? this.formatHeading(this.value) : this.value}
            </div>
        `;
    }

    columnsTemplate() {
        return `
            <div data-element="body" class="column-chart__chart">
                ${this.columnProps?.length ? this.columnProps.map(this.columnTemplate).join('\n') : ''}
            </div>
        `;
    }

    columnTemplate(prop) {
        return `
            <div style="--value: ${prop.value}" data-tooltip="${prop.percent}"></div>
        `;
    }

    template() {
        return `
            <div class="column-chart__title">
                ${this.labelTemplate()}
                ${this.linkTemplate()}
            </div>
            <div class="column-chart__container">
                ${this.valueTemplate()}
                ${this.columnsTemplate()}
            </div>
        `;
    }

    createElement() {
        const element = document.createElement('div');
        element.style.setProperty('--chart-height', this.chartHeight);
        element.className = !this.columnProps?.length
            ? 'column-chart column-chart_loading'
            : 'column-chart';

        element.innerHTML = this.template();

        return element;
    }

    render(container) {
        container.appendChild(this.element);
    }

    update(columnProps) {
        this.columnProps = this.getColumnProps(columnProps);

        const template = Object.assign(document.createElement('template'), {
            innerHTML: this.columnsTemplate(),
        })
        
        this.element.querySelector('.column-chart__chart').replaceWith(template);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

    getColumnProps(data) {
        if (!data || !data.length) {
            return;
        }

        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;
      
        return data.map(item => {
            return {
                percent: (item / maxValue * 100).toFixed(0) + '%',
                value: String(Math.floor(item * scale))
            };
        });
    }
      
}
