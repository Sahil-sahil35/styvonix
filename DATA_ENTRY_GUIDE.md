# Sanity Data Entry Guide

This guide shows you exactly where to copy your content from the old JSON files (`/public/data/*.json`) into the new Sanity Studio.

## How to Use This Guide

1.  Open your Sanity Studio in your web browser (e.g., `https://your-project-name.sanity.studio`).
2.  In the left-hand navigation pane, you will see a list of your Content Types (e.g., Product, Blog, Category).
3.  Click on the Content Type you want to add data to, then click the "Create new" button.
4.  Use the tables below to see which field from your old JSON file goes into which field in the Sanity Studio form.

---

## Products

Navigate to the **Product** content type in your Studio. For each product in your `public/data/products.json` file, create a new entry and fill in the fields like this:

| JSON Field (`products.json`)        | Sanity Studio Field Name    | Instructions                                                                                              |
| ----------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `id`                                | `ID`                        | Copy and paste the product ID (e.g., "prod-001").                                                         |
| `name`                              | `Name`                      | Copy and paste the product name.                                                                          |
| `slug`                              | `Slug`                      | Click **Generate**. Sanity will create a URL-friendly slug from the name.                                 |
| `description`                       | `Description`               | Copy and paste the short description.                                                                     |
| `detailedDescription`               | `Detailed Description`      | Copy and paste the longer, more detailed description.                                                     |
| `negotiable`                        | `Negotiable`                | Toggle this on if the `negotiable` field was `true`.                                                      |
| `price`                             | `Price`                     | Enter the base price number.                                                                              |
| `salePrice`                         | `Sale Price`                | Enter the sale price number if it exists.                                                                 |
| `sku`                               | `SKU`                       | Copy and paste the SKU.                                                                                   |
| `category`                          | `Category`                  | Add each category name as a new item in the list.                                                         |
| `subCategory`                       | `Sub-Category`              | Copy and paste the sub-category.                                                                          |
| `material`                          | `Material`                  | Copy and paste the material.                                                                              |
| `rating`                            | `Rating`                    | Enter the rating number.                                                                                  |
| `reviewCount`                       | `Review Count`              | Enter the number of reviews.                                                                              |
| `stock`                             | `Stock`                     | Enter the stock quantity.                                                                                 |
| `images`                            | `Images`                    | Click **Add item**, then **Upload**, and select the corresponding images from your `public/images/` folder. |
| `videoUrl`                          | `Video URL`                 | Paste the video URL if one exists.                                                                        |
| `specs`                             | `Specs`                     | Fill in each of the specification fields (Mesh Size, Iodine Number, etc.) from the `specs` object.        |
| `documents`                         | `Documents`                 | For each document, click **Add item** and enter the `name` and `url`.                                     |
| `tags`                              | `Tags`                      | Type your tags here. You can press Enter, Tab, or type a comma (`,`) to add a new tag. You can also paste in a comma-separated list of tags. |

---

## Blog Articles

Navigate to the **Blog** content type in your Studio. For each article in `public/data/blog.json`, create a new entry.

| JSON Field (`blog.json`)            | Sanity Studio Field Name    | Instructions                                                                                               |
| ----------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `id`                                | `ID`                        | Copy and paste the article ID (e.g., "blog-001").                                                          |
| `featured`                          | `Featured`                  | Toggle this on if the article should be featured.                                                          |
| `slug`                              | `Slug`                      | Click **Generate**.                                                                                        |
| `images`                            | `Images`                    | Upload the corresponding images from your `public/images/blog/` folder.                                    |
| `category`                          | `Category`                  | Copy and paste the category name.                                                                          |
| `title`                             | `Title`                     | Copy and paste the article title.                                                                          |
| `excerpt`                           | `Excerpt`                   | Copy and paste the short excerpt.                                                                          |
| `date`                              | `Date`                      | Use the date picker to select the publication date.                                                        |
| `readTime`                          | `Read Time`                 | Copy and paste the read time (e.g., "12 min read").                                                        |
| `tags`                              | `Tags`                      | Type your tags here. You can press Enter, Tab, or type a comma (`,`) to add a new tag. You can also paste in a comma-separated list of tags. |
| `contentSections`                   | `Content Sections`          | For each section, click **Add item**. Enter the `imageIndex` (e.g., 0 for the first image) and the `html`. |

---

## Services

Navigate to the **Services** content type in your Studio. For each service in `public/data/services.json`, create a new entry.

| JSON Field (`services.json`)        | Sanity Studio Field Name    | Instructions                                                                     |
| ----------------------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `id`                                | `ID`                        | Copy and paste the service ID (e.g., "serv-001").                                |
| `title`                             | `Title`                     | Copy and paste the service title.                                                |
| `excerpt`                           | `Excerpt`                   | Copy and paste the excerpt text.                                                 |
| `imageUrl`                          | `Image URL`                 | Upload the corresponding image from your `public/images/Services/` folder.       |
| `tags`                              | `Tags`                      | Type your tags here. You can press Enter, Tab, or type a comma (`,`) to add a new tag. You can also paste in a comma-separated list of tags. |

---

## General Site Data

The following content types from `public/data/data.json` should only have **one entry each**. After creating the first entry, you should **edit** it in the future, not create new ones.

### Site

1.  Go to the **Site** content type.
2.  Create **one** new document.
3.  Fill in the `Title`, `Tagline`, `Description`, `Contact` details, and `Social` media links from the `site` object in `data.json`.

### Categories

1.  Go to the **Categories** content type.
2.  Create **one** new document.
3.  Click **Add item** for each category listed in the `categories` array in `data.json`.
4.  For each item, fill in the `Name`, `Description`, and `Image`.

### Features

1.  Go to the **Features** content type.
2.  Create **one** new document.
3.  Click **Add item** for each feature in the `features` array.
4.  For each item, fill in the `Title`, `Description`, and `Icon`.

### Testimonials

1.  Go to the **Testimonials** content type.
2.  Create **one** new document.
3.  Click **Add item** for each testimonial in the `testimonials` array.
4.  For each item, fill in the `Text` and `Author`.

This should cover all the data you need to move. Happy content editing!
