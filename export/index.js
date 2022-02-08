const {exportDataToExcel, exportDataToCSV} = require('../services/exportService');
const db = require("../db/connection");
const fs = require('fs');
const sql = require('./handler/index');
const dir = './export/files';
require('dotenv').config();
const exportableEntityEnums = require('../enums/exportableEntityEnum');
const conditionOperatorEnums = require('../enums/conditionOperatorEnum');
const orderingTypeEnums = require('../enums/orderingTypeEnum');

let append = false;
const limit = process.env.EXPORT_LIMIT
let offset = 0;

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

for (let index = 0; index < 2; index++) {
    db.query(sql(limit, offset, args), (error, result) => {
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
            if (index > 0) {
                append = true;
            }

            exportDataToExcel(result, append);

        } else if (process.argv[2] == 'csv') {
            exportDataToCSV(result, append);
        }
    });

    offset += limit;
}