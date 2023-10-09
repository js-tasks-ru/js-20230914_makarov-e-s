export default class NotificationMessage {

    static timer;
    static lastElement;

    constructor(message, config) {
        this.message = message;
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
                    ${this.message || ''}
                </div>
            </div>
        `;
    }

    show(element) {
        if (NotificationMessage.lastElement) {
            NotificationMessage.lastElement.destroy();
        }

        if (NotificationMessage.timer) {
            clearTimeout(NotificationMessage.timer);
        }

        this.element = element || this.element;

        this.render(document.body);

        NotificationMessage.timer = setTimeout(() => {
            this.destroy();
        }, this.duration);
    }

    render(container) {
        container.appendChild(this.element);
        NotificationMessage.lastElement = this;
    }

    remove() {
        this.element.remove();
        NotificationMessage.lastElement = null;
    }

    destroy() {
        this.remove();
    }
}
