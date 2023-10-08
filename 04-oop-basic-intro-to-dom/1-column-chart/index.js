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

    template() {
        return `
            <div class="column-chart__title">
                Total ${this.label}
                ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">
                    ${this.formatHeading ? this.formatHeading(this.value) : this.value}
                </div>
                <div data-element="body" class="column-chart__chart">
                    ${this.columnProps && this.columnProps.length
                        ? this.columnProps.map(
                            prop => `<div style="--value: ${prop.value}" data-tooltip="${prop.percent}"></div>`
                          ).join('\n')
                        : ''
                    }
                </div>
            </div>
        `;
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add('column-chart')
        if (!this.columnProps || !this.columnProps.length) {
            element.classList.add('column-chart_loading');
        }
        element.style.setProperty('--chart-height', this.chartHeight);

        element.innerHTML = this.template();

        return element;
    }

    render(container) {
        container.appendChild(this.element);
    }

    update(columnProps) {
        this.columnProps = this.getColumnProps(columnProps);

        const container = this.element.parentNode;

        if (container) {
            this.destroy();

            this.element = this.createElement();
    
            this.render(container);
        } else {
            this.element = this.createElement();
        }
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
