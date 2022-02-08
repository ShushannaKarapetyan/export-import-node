const {exportDataToExcel, exportDataToCSV} = require('../services/exportService');
const db = require("../db/connection");
const fs = require('fs');
const sql = require('./handler/index');
const dir = './export/files';
require('dotenv').config();
const exportableEntityEnums = require('../enums/exportableEntityEnum');
const conditionOperatorEnums = require('../enums/conditionOperatorEnum');
const orderingTypeEnums = require('../enums/orderingTypeEnum');
const excelJS = require('exceljs');

let append = false;
const limit = process.env.EXPORT_LIMIT
let offset = 0;
const path = `${dir}/categories.xlsx`;

const params = {
    limit: 10000,
    offset: 0,
    filename: `${dir}/categories_export.csv`,
    append: false,
    headers: true,
};

let args = {
    'type': exportableEntityEnums.CATEGORY,
    'searchTerm': 'Shoes',
    'filters': [
        {
            'column': 'status',
            'operator': conditionOperatorEnums.EQ,
            'value': 1,
        },
        {
            'column': 'created_at',
            'operator': conditionOperatorEnums.LT,
            'value': '2022-02-08',
        },
    ],
    'ordering': {
        'column': 'name',
        'order': orderingTypeEnums.DESC,
    },
};

async function test() {
    await exportData(params);
}

test();

//
// for (let index = 0; index < 10; index++) {
//     db.query(sql(limit, offset, args), (error, result) => {
//         if (error) {
//             throw error;
//         }
//
//         if (!fs.existsSync(dir)) {
//             try {
//                 fs.mkdirSync(dir);
//             } catch (e) {
//                 throw e;
//             }
//         } else {
//             console.log("Directory already exist.");
//         }
//
//         if (process.argv[2] == 'excel') {
//             if (index > 0) {
//                 append = true;
//             }
//
//             exportDataToExcel(result, append);
//         } else if (process.argv[2] == 'csv') {
//             exportDataToCSV(result, params);
//             params.append = true;
//         }
//     });
//
//     offset += limit;
// }

async function fetchRecords(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, data) => {
            if (err) reject(err);

            resolve(data);
        });
    });
}

async function exportData(exportParams) {
    let {limit, offset} = exportParams;
    try {
        let data;
        while ((data = await fetchRecords(sql(limit, offset))
        ) && data.length) {
            const jsonData = JSON.parse(JSON.stringify(data));
            if (process.argv[2] == 'excel') {
                exportDataToExcel(jsonData, params.append);
            } else if (process.argv[2] == 'csv') {
                exportDataToCSV(jsonData, exportParams);
            }

            params.append = true;
            offset += limit;
        }
    } catch (e) {
        console.log({'error': e});
    }
}


