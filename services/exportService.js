const xlsx = require("xlsx");
const path = require("path");
const excelJS = require("exceljs");
const dir = './export/files';

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ...data
    ];

    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));

    console.log('File created.');


    // const options = {
    //     filename: './export/files/file.xlsx',
    //     useStyles: true,
    //     useSharedStrings: true
    // };
    //
    // const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    // const worksheet = workbook.addWorksheet('my sheet');
    //
    // worksheet.columns = [
    //     {header: 'ID', key: 'id'},
    //     {header: 'name', key: 'name'},
    // ]
    //
    // let result = data[0];
    // for (let i = 1; i <= 3; i++) {
    //     // console.log(data[0])
    //     //data[i].forEach(function (element) {
    //         //console.log(Array.from(data[i]))
    //     //});
    //
    //     console.log(result[i].id, result[i]);
    //
    //     let d = {
    //         id: result[i].id,
    //         name: result[i].name + i,
    //     };
    //
    //     worksheet.addRow(d).commit();
    // }
    //
    // workbook.commit().then(function () {
    //     console.log('excel file created');
    // });
}

// const exportToExcel = (result, workSheetColumnNames, workSheetName, filePath) => {
//     const data = result.map(d => {
//         return [
//             d.ID,
//             d.name,
//             d.parent_name,
//             d.company_name,
//             d.slug,
//             d.description,
//             d.status,
//             d.url_path,
//             d.locale,
//             d.meta_title,
//             d.meta_description,
//             d.meta_keywords,
//             d.created_at,
//             d.updated_at,
//         ];
//     });
//
//     exportExcel(data, workSheetColumnNames, workSheetName, filePath);
// }

const exportDataToExcel = (result, append) => {
    const workbook = new excelJS.Workbook();
    const file = 'categories.xlsx'
    const worksheet = workbook.addWorksheet("Categories");

    worksheet.columns = [
        {header: "ID", key: "ID", width: 10},
        {header: "name", key: "name", width: 10},
        {header: "parent_name", key: "parent_name", width: 10},
        {header: "company_name", key: "company_name", width: 10},
        {header: "slug", key: "slug", width: 10},
        {header: "description", key: "description", width: 10},
        {header: "status", key: "status", width: 10},
        {header: "url_path", key: "url_path", width: 10},
        {header: "locale", key: "locale", width: 10},
        {header: "meta_title", key: "meta_title", width: 10},
        {header: "meta_description", key: "meta_description", width: 10},
        {header: "meta_keywords", key: "meta_keywords", width: 10},
        {header: "created_at", key: "created_at", width: 10},
        {header: "updated_at", key: "updated_at", width: 10},
    ];

    // worksheet.columns = [];
    //
    // for (let key in result[0]) {
    //     worksheet.columns.push({
    //         header: key, key: key, width: 10,
    //     });
    // }
    //
    // console.log(worksheet.columns)

    if (append == false) {
        let counter = 1;

        result.forEach((category) => {
            worksheet.addRow(category);
            counter++;
        });

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
        });

        workbook.xlsx.writeFile(`${dir}/${file}`)
            .then(() => console.log('Done'))
            .catch((err) => console.log(err));
    } else {
        workbook.xlsx.readFile(`${dir}/${file}`)
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

                return workbook.xlsx.writeFile(`${dir}/${file}`);
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