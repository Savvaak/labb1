const createSortArr = (data) => {
    let sortArr = [];

    const sortSelects = data.getElementsByTagName('select');

    for (const item of sortSelects) {
        // получаем номер выбранной опции
        const keySort = item.value;
        // в случае, если выбрана опция Нет, заканчиваем формировать массив
        if (keySort == 0) {
            break;
        }
        // получаем порядок сортировки очередного уровня
        // имя флажка сформировано как имя поля SELECT и слова Desc
        const desc = document.getElementById(item.id + 'Desc').checked;
        // очередной элемент массива - по какому столбцу и в каком порядке сортировать 
        sortArr.push(
            {
                column: keySort - 1,
                direction: desc
            }
        );
    }
    return sortArr;
};
const sortTable = (idTable, formData) => {

    // формируем управляющий массив для сортировки
    const sortArr = createSortArr(formData);

    // сортировать таблицу не нужно, во всех полях выбрана опция Нет

    if (sortArr.length === 0) {
        return false;
    }
    //находим нужную таблицу
    let table = document.getElementById(idTable);

    // преобразуем строки таблицы в массив 
    let rowData = Array.from(table.rows);

    // удаляем элемент с заголовками таблицы
    const headerRow = rowData.shift();

    //сортируем данные по всем уровням сортировки
    rowData.sort((first, second) => {
        for (let { column, direction } of sortArr) {
            const firstCell = first.cells[column].innerHTML;
            const secondCell = second.cells[column].innerHTML;

            // используем localeCompare для корректного сравнения
            let comparison

            if (column < 4) {
                comparison = firstCell.localeCompare(secondCell);
            }
            else {
                const frnum = parseFloat(firstCell);
                const scnum = parseFloat(secondCell);
                comparison = frnum - scnum;
            }

            // учитываем направление сортировки
            if (comparison !== 0) {
                return (direction ? -comparison : comparison);
            }
        }
        return 0;
    });

    clearTable(idTable);
    //выводим отсортированную таблицу на страницу
    table.append(headerRow);

    let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
    table.append(tbody);
    return true;
};