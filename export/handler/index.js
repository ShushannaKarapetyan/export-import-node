const conditionOperatorEnums = require('../../enums/conditionOperatorEnum');
const categoriesConditionColumnEnum = require('../../enums/categoriesConditionColumnEnum');

function handle(limit, offset, args) {
    // let type, searchTerm, ordering, filters;
    //
    // if (Object.keys(args).length != 0) {
    //     type = args.type;
    //     searchTerm = args.searchTerm;
    //     filters = args.filters;
    //     ordering = args.ordering;
    // }

    //return filter(type, searchTerm, filters, ordering, limit, offset);

    return `SELECT categories.id  as ID,
                        category_translations.name,
                        ctr.name       as parent_name,
                        companies.name as company_name,
                        category_translations.slug,
                        category_translations.description,
                        CASE
                            WHEN categories.status = 1 THEN 'Active'
                            WHEN categories.status = 0 THEN 'Inactive'
                            END        as status,
                        category_translations.url_path,
                        category_translations.locale,
                        category_translations.meta_title,
                        category_translations.meta_description,
                        category_translations.meta_keywords,
                        categories.created_at,
                        categories.updated_at
                 FROM categories
                          JOIN category_translations
                               ON categories.id = category_translations.category_id
                          JOIN companies
                               ON categories.company_id = companies.id
                          JOIN category_translations ctr
                               ON categories.parent_id = ctr.id
                 WHERE categories.status = 1
--               AND categories.created_at < "2022-02-06"
--              AND category_translations.name LIKE '%Shoes%'
                 ORDER BY category_translations.name DESC
                     LIMIT ${limit}
                 OFFSET ${offset}
                 `;
}

function filter(type, searchTerm, filters, ordering, limit, offset) {
    let query;
    let condition;
    let isWhereExists = false
    let tableName;

    if (type == 'category') {
        tableName = 'categories';

        query = `SELECT categories.id  as ID,
                        category_translations.name,
                        ctr.name       as parent_name,
                        companies.name as company_name,
                        category_translations.slug,
                        category_translations.description,
                        categories.status,
                        category_translations.url_path,
                        category_translations.locale,
                        category_translations.meta_title,
                        category_translations.meta_description,
                        category_translations.meta_keywords,
                        categories.created_at,
                        categories.updated_at
                 FROM categories
                          JOIN category_translations
                               ON categories.id = category_translations.category_id
                          JOIN companies
                               ON categories.company_id = companies.id
                          JOIN category_translations ctr
                               ON categories.parent_id = ctr.id`;

        let conditions = {
            [categoriesConditionColumnEnum.ID](filter, tableName) {
                query = `${query} ${isWhereExists ? "AND" : "WHERE"} ${tableName}.${filter.column} ${filter.operator} ${filter.value}`;
            },
            [categoriesConditionColumnEnum.PARENT_NAME](filter) {
                query = `${query} ${isWhereExists ? "AND" : "WHERE"} ${filter.column} ${filter.operator} ${filter.value}`;
            },
            [categoriesConditionColumnEnum.STATUS](filter, tableName) {
                query = `${query} ${isWhereExists ? "AND" : "WHERE"} ${tableName}.${filter.column} ${filter.operator} ${filter.value}`;
            },
            [categoriesConditionColumnEnum.NAME](filter, tableName) {
                query = `${query} ${isWhereExists ? "AND" : "WHERE"} ${tableName}.${filter.column} ${filter.operator} ${filter.value}`;
            },
            [categoriesConditionColumnEnum.CREATED_AT](filter, tableName) {
                query = `${query} ${isWhereExists ? "AND" : "WHERE"} ${tableName}.${filter.column} ${filter.operator} ${filter.value}`;
            },
        };

        filters.forEach(filter => {
            // console.log(filter)
            conditions[filter.column](filter, tableName);
            if (!isWhereExists) {
                isWhereExists = true
            }
        });


        //console.log(query)


        query = `SELECT categories.id  as ID,
                        category_translations.name,
                        ctr.name       as parent_name,
                        companies.name as company_name,
                        category_translations.slug,
                        category_translations.description,
                        CASE
                            WHEN categories.status = 1 THEN 'Active'
                            WHEN categories.status = 0 THEN 'Inactive'
                            END        as status,
                        category_translations.url_path,
                        category_translations.locale,
                        category_translations.meta_title,
                        category_translations.meta_description,
                        category_translations.meta_keywords,
                        categories.created_at,
                        categories.updated_at
                 FROM categories
                          JOIN category_translations
                               ON categories.id = category_translations.category_id
                          JOIN companies
                               ON categories.company_id = companies.id
                          JOIN category_translations ctr
                               ON categories.parent_id = ctr.id
                 WHERE categories.status = 1
--               AND categories.created_at < "2022-02-06"
--              AND category_translations.name LIKE '%Shoes%'
                 ORDER BY category_translations.name DESC
                     LIMIT ${limit}
                 OFFSET ${offset}`;
    }

    return query;
}

module.exports = handle;