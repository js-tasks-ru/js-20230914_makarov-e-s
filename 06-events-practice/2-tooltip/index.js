class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    return Tooltip.instance = this;
  }

  initialize () {
    this.element = this.createElement();

    this.addEventListeners();
  }

  createElement() {
    return Object.assign(document.createElement('div'), {
      className: 'tooltip',
    });
  }

  addEventListeners() {
    document.addEventListener('pointerover', this.onElementPointerover);
    document.addEventListener('pointerout', this.onElementPointerout);
  }

  removeEventListeners() {
    document.removeEventListener('pointerover', this.onElementPointerover);
    document.removeEventListener('pointerout', this.onElementPointerout);
  }

  onElementPointerover = (event) => {
    if (event.target.dataset.tooltip) {
      this.element.innerHTML = event.target.dataset.tooltip;

      this.onElementPointermove(event);

      document.addEventListener('pointermove', this.onElementPointermove);

      this.render();
    }
  }

  onElementPointerout = () => {
    document.removeEventListener('pointermove', this.onElementPointermove);

    this.remove();
  }

  onElementPointermove = (event) => {
    this.element.style.setProperty('top', `${event.clientY + 10}px`);
    this.element.style.setProperty('left', `${event.clientX + 10}px`);
  }

  render() {
    document.body.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();

    this.removeEventListeners();
  }
}

export default Tooltip;
