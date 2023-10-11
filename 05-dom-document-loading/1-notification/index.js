export default class NotificationMessage {

    static currentElement;

    constructor(message, config) {
        this.message = message || '';
        this.duration = config?.duration || 0;
        this.type = config?.type || '';

        this.element = this.createElement();
    }

    createElement() {
        const element = document.createElement('div');
        element.style.setProperty('--value', this.duration);
        element.className = `notification ${this.type}`;

        element.innerHTML = this.template();

        return element;
    }

    template() {
        return `
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        `;
    }

    show(container = document.body) {
        if (NotificationMessage.currentElement) {
            NotificationMessage.currentElement.destroy();
        }

        container.appendChild(this.element);
        NotificationMessage.currentElement = this;

        this.timer = setTimeout(() => {
            this.destroy();
        }, this.duration);
    }

    remove() {
        this.element.remove();
        NotificationMessage.currentElement = null;
    }

    destroy() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.remove();
    }
}
