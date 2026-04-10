// Входные данные:
//   data - исходный массив (например, buildings)
//   key - поле, по которому осуществляется группировка

function createArrGraph(data, key) {

    const groupObj = d3.group(data, d => d[key]);

    let arrGraph = [];

    for (let entry of groupObj) {
        const minMax = d3.extent(entry[1].map(d => d['Объём двигателя']));
        arrGraph.push({ labelX: entry[0], values: minMax });
    }
    if (key === 'Год') {
        arrGraph.sort((a, b) => a.labelX - b.labelX);
        return arrGraph;
    }
    else {
        return arrGraph;
    }
};
function drawGraph(data, dataForm, index, type) {

    let arrGraph = createArrGraph(data, dataForm);

    const svg = d3.select("svg")
    svg.selectAll('*').remove();

    const attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    }

    // создаем шкалы преобразования и выводим оси
    const [scX, scY] = createAxis(svg, arrGraph, attr_area, index);

    // рисуем график
    if (index === 1) {
        createChart(svg, arrGraph, scX, scY, attr_area, "blue", index, type);
    }
    else if (index === 0) {
        createChart(svg, arrGraph, scX, scY, attr_area, "red", index, type);
    }
    else {
        createChart(svg, arrGraph, scX, scY, attr_area, "blue", 1, type);
        createChart(svg, arrGraph, scX, scY, attr_area, "red", 0, type);
    }
};
function createAxis(svg, data, attr_area, index) {
    let min;
    let max;
    if (index === -1) {
        min = d3.min(data.map(d => d.values[0]));
        max = d3.max(data.map(d => d.values[1]));
    }
    else {
        [min, max] = d3.extent(data.map(d => d.values[index]));
    }

    // функция интерполяции значений на оси
    // по оси ОХ текстовые значения
    const scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX]);

    const scaleY = d3.scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);

    // создание осей
    const axisX = d3.axisBottom(scaleX); // горизонтальная 
    const axisY = d3.axisLeft(scaleY); // вертикальная

    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, 
                                      ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY]
};
function createChart(svg, data, scaleX, scaleY, attr_area, color, index, type) {
    const r = 3 + index;

    if (type == 0) {
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[index]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", color);
        return;
    }
    else if (type == 1) {
        svg.selectAll(".rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => scaleX(d.labelX) + (scaleX.bandwidth() / 2) - (scaleX.bandwidth() / 4) * index)
            .attr("width", scaleX.bandwidth() / 4)
            .attr("height", d => attr_area.height - 2 * attr_area.marginY - scaleY(d.values[index]))
            .attr("y", d => scaleY(d.values[index]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", color);
        return;
    }
    let lineF = d3.line()
        .x(d => scaleX(d.labelX ) + scaleX.bandwidth() / 2)
        .y(d => scaleY(d.values[index]))
        .curve(d3.curveMonotoneX);
    chart = svg.append("path")
        .datum(data)
        .attr("d", lineF)
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("stroke-width", "2")
        .style("stroke", color);
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
        .attr("cy", d => scaleY(d.values[index]))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", color);
};