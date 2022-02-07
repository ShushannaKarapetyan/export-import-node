const {exportDataToExcel, exportDataToCSV} = require('../services/exportService');
const db = require("../db/connection");
const fs = require('fs');
const sql = require('./handler/index');
const dir = './export/files';

let append = false;
let limit = 100;
let offset = 0;

for (let index = 0; index < 10; index++) {
    db.query(sql(limit, offset), (error, result) => {
        if (error) {
            throw error;
        }

        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir);
            } catch (e) {
                throw e;
            }
        } else {
            console.log("Directory already exist.");
        }

        if (process.argv[2] == 'excel') {

            // const workSheetName = 'Categories';
            // //const filePath = `${dir}/excel_${Date.now()}.xlsx`;
            // const filePath = './export/files/file.xlsx';
            // const workSheetColumnName = [
            //     'ID',
            //     'name',
            //     'parent_name',
            //     'company_name',
            //     'slug',
            //     'description',
            //     'status',
            //     'url_path',
            //     'locale',
            //     'meta_title',
            //     'meta_description',
            //     'meta_keywords',
            //     'created_at',
            //     'updated_at',
            // ];
            //
            // exportDataToExcel(result, workSheetColumnName, workSheetName, filePath);

            if (index > 0) {
                append = true;
            }

            exportDataToExcel(result, append);

        } else if (process.argv[2] == 'csv') {
            exportDataToCSV(result, append);
        }
    });

    offset += limit;
    console.log(offset)
}