import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
    constructor(config) {
        super(config);

        this.url = new URL(config?.url, BACKEND_URL);
        this.range = config?.range;

        this.update(this.range?.from, this.range?.to);
    }

    async update(from, to) {
        this.url.searchParams.set('from', from);
        this.url.searchParams.set('to', to);

        this.loading = true;

        const response = await fetchJson(this.url);

        this.loading = false;

        const values = Object.values(response);
        const total = values.reduce((acc, item) => acc + item);

        super.update(values, total);

        return response;
    }
}
