function handle(limit, offset) {
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
              AND categories.created_at < "2022-02-06"
--              AND category_translations.name LIKE '%Shoes%'
            ORDER BY category_translations.name DESC  
            LIMIT ${limit}
            OFFSET ${offset}`;
}

module.exports = handle;