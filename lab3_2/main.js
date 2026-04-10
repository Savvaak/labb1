document.addEventListener("DOMContentLoaded", function () {
    createTable(cars, 'list');
    const sortForm = document.getElementById('sort');
    setSortSelects(cars[0], sortForm);
    let filtred = false;

    const finButton = document.getElementById("fin");
    const filt = document.getElementById("filter");
    finButton.addEventListener('click', function (event) {
        filterTable(cars, 'list', filt);
        clearSelects(sortForm);
        filtred = true;
    });

    const clButton = document.getElementById("cl");
    clButton.addEventListener('click', function (event) {
        clearFilter(cars, 'list', filt);
        clearSelects(sortForm);
        filtred = false;
    });

    const fr = document.getElementById("fieldsFirst");
    const fs = document.getElementById("fieldsSecond")
    fr.addEventListener('change', function (event) {
        changeNextSelect(fr, "fieldsSecond");
        changeNextSelect(fs, "fieldsThird");
    });

    fs.addEventListener('change', function (event) {
        changeNextSelect(fs, "fieldsThird");
    });

    const sortButton = document.getElementById('sortBtn');
    sortButton.addEventListener('click', function (event) {
        if (!sortTable('list', sortForm)) {
            if (filtred) {
                filterTable(cars, 'list', filt);
            } else {
                clearTable('list');
                createTable(cars, 'list');
                clearSelects(sortForm);
            }
        }
    });

    const clearSortButton = document.getElementById('clearSort');
    clearSortButton.addEventListener('click', function (event) {
        clearSort('list', filtred, filt, sortForm);
    });
    buildbut = d3.select("#buildbut");
    min = d3.select("#minheight")
        .on("click", function () {
            d3.select("#alert")
                .classed("hidden", true)
            d3.select("#svg")
                .classed("hidden", false);
        });
    max = d3.select("#maxheight")
        .on("click", function () {
            d3.select("#alert")
                .classed("hidden", true)
            d3.select("#svg")
                .classed("hidden", false);
        });
    buildbut.on("click", function () {
        const keyX = d3.selectAll("input[name='keyX']")
            .filter(function () { return this.checked; })
            .node().value;
        const minheight = d3.select("#minheight").node().checked;
        const maxheight = d3.select("#maxheight").node().checked;
        const type = d3.select("#diag").node().value;
        let index;
        if (minheight && maxheight) {
            index = -1;
        }
        else if (minheight) {
            index = 0;
        }
        else if (maxheight) {
            index = 1;
        }
        else {
            d3.select("#alert")
                .classed("hidden", false)
            d3.select("#svg")
                .classed("hidden", true);
            return;
        }
        drawGraph(cars, keyX, index, type);
    });
});

const createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

const setSortSelect = (arr, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
    arr.forEach((item, index) => {
        sortSelect.append(createOption(item, index + 1));
    });
};

const setSortSelects = (data, dataForm) => {
    const head = Object.keys(data);
    const allSelect = dataForm.getElementsByTagName('select');

    for (let i = 0; i < allSelect.length; i++) {
        setSortSelect(head, allSelect[i]);
        if (i > 0) {
            allSelect[i].disabled = true;
        }
    }
};

const changeNextSelect = (curSelect, nextSelectId) => {
    let nextSelect = document.getElementById(nextSelectId);
    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;

    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.value);
    } else {
        nextSelect.disabled = true;
    }
};

const clearSelects = (dataForm) => {
    const allSelect = dataForm.getElementsByTagName('select');
    const checkboxes = dataForm.querySelectorAll('input[type="checkbox"]');
    allSelect[0].selectedIndex = 0;
    for (let i = 1; i < allSelect.length; i++) {
        allSelect[i].disabled = true;
    }
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
};

const clearSort = (idTable, filtred, filterForm, sortForm) => {
    if (filtred) {
        filterTable(cars, idTable, filterForm);
    } else {
        clearTable('list');
        createTable(cars, 'list');
    }
    clearSelects(sortForm);
};