export default class DoubleSlider {
    #element;
    subElements;
    currentThumbElement;

    innerElementRect;

    set element(element) {
        this.#element = element;
        this.subElements = {
            innerElement: this.#element.querySelector('.range-slider__inner'),
            progressElement: this.#element.querySelector('.range-slider__progress'),
            leftThumbLabelElement: this.#element.querySelector('span[data-element="from"]'),
            leftThumbElement: this.#element.querySelector('.range-slider__thumb-left'),
            rightThumbLabelElement: this.#element.querySelector('span[data-element="to"]'),
            rightThumbElement: this.#element.querySelector('.range-slider__thumb-right'),
        };
    }

    get element() {
        return this.#element;
    }

    get left() {
        return this.selected.from - this.min;
    }

    get right() {
        return this.max - this.selected.to;
    }
    
    constructor(config = {
        min: 100,
        max: 200,
        formatValue: value => '$' + value,
        selected: {},
    }) {
        this.min = config?.min;
        this.max = config?.max;
        this.formatValue = config?.formatValue;
        this.selected = {
            from: config?.selected?.from ?? this.min,
            to: config?.selected?.to ?? this.max,
        };

        this.element = this.createElement();

        this.addEventListeners();
    }

    createElement() {
        return Object.assign(document.createElement('div'), {
            className: 'range-slider',
            innerHTML: this.template(),
        });
    }


    template() {
        return `
            <span data-element="from">${this.convertValueToFormatValue(this.selected.from)}</span>

            <div class="range-slider__inner">
                <span class="range-slider__progress"
                        style="left: ${this.convertValueToPercent(this.left)};
                               right: ${this.convertValueToPercent(this.right)}"
                ></span>

                <span class="range-slider__thumb-left"
                      style="left: ${this.convertValueToPercent(this.left)}"
                ></span>

                <span class="range-slider__thumb-right"
                      style="right: ${this.convertValueToPercent(this.right)}"
                ></span>
            </div>

            <span data-element="to">${this.convertValueToFormatValue(this.selected.to)}</span>
        `;
    }

    addEventListeners() {
        document.addEventListener('pointerdown', this.onThumbPointerdown);
        document.addEventListener('pointerup', this.onThumbPointerup);
    }

    removeEventListeners() {
        document.removeEventListener('pointerdown', this.onThumbPointerdown);
        document.removeEventListener('pointerup', this.onThumbPointerup);
    }

    onThumbPointerdown = (event) => {
        if (event.target === this.subElements.leftThumbElement ||
            event.target === this.subElements.rightThumbElement) {

            this.currentThumbElement = event.target;

            this.innerElementRect = this.subElements.innerElement.getBoundingClientRect();

            document.addEventListener('pointermove', this.onThumbPointerMove);
        }
    }

    onThumbPointerup = () => {
        this.currentThumbElement = null;

        document.removeEventListener('pointermove', this.onThumbPointerMove);
    }

    onThumbPointerMove = (event) => {
        const value = this.convertPositionToValue(event.clientX - this.innerElementRect.left);
        if (this.currentThumbElement === this.subElements.leftThumbElement) {
            this.selected.from = value >= this.min && value <= this.selected.to
                ? value
                : value > this.selected.to
                    ? this.selected.to
                    : this.min;
            this.subElements.progressElement.style.setProperty('left', this.convertValueToPercent(this.left));
            this.subElements.leftThumbElement.style.setProperty('left', this.convertValueToPercent(this.left));
            this.subElements.leftThumbLabelElement.textContent = this.convertValueToFormatValue(this.selected.from);
        } else {
            this.selected.to = value >= this.selected.from && value <= this.max
                ? value
                : value < this.selected.from
                    ? this.selected.from
                    : this.max;
            this.subElements.progressElement.style.setProperty('right', this.convertValueToPercent(this.right));
            this.subElements.rightThumbElement.style.setProperty('right', this.convertValueToPercent(this.right));
            this.subElements.rightThumbLabelElement.textContent = this.convertValueToFormatValue(this.selected.to);
        }

        this.element.dispatchEvent(new CustomEvent("range-select", {
            detail: this.selected,
        }));
    }

    convertPositionToValue(position) {
        return Math.floor(this.min + (this.max + 1 - this.min) * position / this.innerElementRect.width) || 0;
    }

    convertValueToPercent(value) {
        return `${value / (this.max - this.min) * 100}%`;
    }

    convertValueToFormatValue(value) {
        return this.formatValue ? this.formatValue(value) : value;
    }

    render(container = document.body) {
        container.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();

        this.removeEventListeners();
    }
}
