const excelJS = require('exceljs');
const fastCSV = require('fast-csv');
const fs = require("fs");
const dir = './export/files';

const exportDataToExcel = (result, append) => {
    const workbook = new excelJS.Workbook();
    const path = `${dir}/categories.xlsx`;
    const worksheet = workbook.addWorksheet("Categories");

    worksheet.columns = Object.keys(result[0]).map(el => ({
        header: el,
        key: el,
        width: 10,
    }));

    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir);
        } catch (e) {
            throw e;
        }
    }

    if (append == false) {
        //result.forEach((category) => {
            worksheet.addRows(result);
        //});

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
        });

        workbook.xlsx.writeFile(path)
            .then(() => console.log('File created.'))
            .catch((err) => console.log(err));
    } else {
        workbook.xlsx.readFile(path)
            .then(function () {
                let worksheet = workbook.getWorksheet(1);

                result.forEach((category) => {
                    let lastRow = worksheet.lastRow;
                    let getRowInsert = worksheet.getRow(++(lastRow.number));

                    Object.values(category).forEach((value, index) => {
                        getRowInsert.getCell(index + 1).value = value;
                    });

                    getRowInsert.commit();
                });

                return workbook.xlsx.writeFile(path);
            })
            .catch(error => {
                console.log(error)
            });
    }
}

const exportDataToCSV = (jsonData, params) => {
    let {filename, headers, append} = params;
    const flags = append === true ? 'a' : 'w'
    const ws = fs.createWriteStream(filename, {flags, rowDelimiter: '\r\n'})
    fastCSV
        .write(jsonData, {headers})
        .on('finish', () => {
            // logger.info('Categories successfully exported!');
            console.log('Categories successfully exported!');
        })
        .pipe(ws);
}

module.exports = {
    exportDataToExcel,
    exportDataToCSV,
};