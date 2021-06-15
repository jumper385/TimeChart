export class NearestPoint {
    constructor(svg, options, pModel) {
        this.svg = svg;
        this.options = options;
        this.pModel = pModel;
        this.intersectPoints = new Map();
        const initTrans = svg.svgNode.createSVGTransform();
        initTrans.setTranslate(0, 0);
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
.timechart-crosshair-intersect {
    fill: var(--background-overlay, white);
    visibility: hidden;
}
.timechart-crosshair-intersect circle {
    r: 3px;
}`;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('timechart-crosshair-intersect');
        g.appendChild(style);
        this.container = g;
        this.adjustIntersectPoints();
        svg.svgNode.appendChild(g);
        pModel.updated.on(() => this.adjustIntersectPoints());
    }
    adjustIntersectPoints() {
        const initTrans = this.svg.svgNode.createSVGTransform();
        initTrans.setTranslate(0, 0);
        for (const s of this.options.series) {
            if (!this.intersectPoints.has(s)) {
                const intersect = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                intersect.style.stroke = s.color.toString();
                intersect.style.strokeWidth = `${s.lineWidth ?? this.options.lineWidth}px`;
                intersect.transform.baseVal.initialize(initTrans);
                this.container.appendChild(intersect);
                this.intersectPoints.set(s, intersect);
            }
            const intersect = this.intersectPoints.get(s);
            const point = this.pModel.points.get(s);
            if (!point) {
                intersect.style.visibility = 'hidden';
            }
            else {
                intersect.style.visibility = 'visible';
                intersect.transform.baseVal.getItem(0).setTranslate(point.x, point.y);
            }
        }
    }
}
export const nearestPoint = {
    apply(chart) {
        return new NearestPoint(chart.svgLayer, chart.options, chart.nearestPoint);
    }
};
//# sourceMappingURL=nearestPoint.js.map