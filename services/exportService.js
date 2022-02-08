const excelJS = require("exceljs");
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

    // worksheet.columns = [
    //     {header: "ID", key: "ID", width: 10},
    //     {header: "name", key: "name", width: 10},
    //     {header: "parent_name", key: "parent_name", width: 10},
    //     {header: "company_name", key: "company_name", width: 10},
    //     {header: "slug", key: "slug", width: 10},
    //     {header: "description", key: "description", width: 10},
    //     {header: "status", key: "status", width: 10},
    //     {header: "url_path", key: "url_path", width: 10},
    //     {header: "locale", key: "locale", width: 10},
    //     {header: "meta_title", key: "meta_title", width: 10},
    //     {header: "meta_description", key: "meta_description", width: 10},
    //     {header: "meta_keywords", key: "meta_keywords", width: 10},
    //     {header: "created_at", key: "created_at", width: 10},
    //     {header: "updated_at", key: "updated_at", width: 10},
    // ];

    if (append == false) {
        let counter = 1;

        result.forEach((category) => {
            worksheet.addRow(category);
            counter++;
        });

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

const exportDataToCSV = (result, append) => {

}

module.exports = {
    exportDataToExcel,
    exportDataToCSV,
};