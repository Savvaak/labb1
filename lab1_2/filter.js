const correspond = {
    "Название": "name",
    "Год": ["yearFrom", "yearTo"],
    "Страна": "country",
    "Модель двигателя": "engine",
    "Объём двигателя": ["volumeFrom", "volumeTo"],
    "Разгон": ["accelFrom", "accelTo"]
};

const dataFilter = (dataForm) => {
    let dictFilter = {};

    for (const item of dataForm.elements) {
        let valInput = item.value;

        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        }
        if (item.type === "number") {
            if (valInput === '') {
                if (item.id.includes("From")) {
                    valInput = -Infinity;
                } else if (item.id.includes("To")) {
                    valInput = +Infinity;
                }
            } else {
                valInput = Number(valInput);
            }
        }
        if (item.type === "button") {
            continue;
        }

        dictFilter[item.id] = valInput;
    }
    return dictFilter;
};

const filterTable = (data, idTable, dataForm) => {
    const datafilter = dataFilter(dataForm);

    let tableFilter = data.filter(item => {
        let result = true;

        Object.entries(item).map(([key, val]) => {
            if (typeof val == 'string') {
                result &= val.toLowerCase().includes(datafilter[correspond[key]] || '');
            }

            if (typeof val == "number") {
                result &= datafilter[correspond[key][0]] <= val;
                result &= val <= datafilter[correspond[key][1]];
            }
        });

        return result;
    });

    clearTable(idTable);
    createTable(tableFilter, idTable);
};

const clearFilter = (data, idTable, dataForm) => {
    dataForm.reset();
    clearTable(idTable);
    createTable(data, idTable);
};