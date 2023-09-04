# Product Management

Node.js CRUD API using Express and JSON File Storage

## Overview

This project is a simple Node.js CRUD (Create, Read, Update, Delete) API built using the Express.js framework and JSON file storage. It provides basic endpoints to manage items, including creating, reading, updating, and deleting items.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Routes](#api-routes)
  - [Create a New Item](#create-a-new-item)
  - [Get All Items](#get-all-items)
  - [Get an Item by ID](#get-an-item-by-id)
  - [Update an Item by ID](#update-an-item-by-id)
  - [Delete an Item by ID](#delete-an-item-by-id)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Testing](#testing)


## Getting Started

### Prerequisites

- Node.js installed 
- npm (Node Package Manager) installed
- Git (optional)

### Installation

To install the project, follow these steps:

1. Clone the repository (if you haven't already):

   ```bash
        git clone https://github.com/your-username/your-project.git

2. Navigate to the project directory:

    ```bash
        cd product-management

3. Install the project dependencies:

    ```bash
        npm install

### Running the Application

To run the application locally, use the following command:

    ```bash
        npm run start

The application will start and be accessible at http://localhost:8080 by default.

## API Routes

###Create a New Item

- Endpoint: POST /item/add

- Description: Create a new item.

- Request Body:

itemName (string, required): Name of the item.
itemPrice (number, required): Price of the item.
itemCategory (string): Category of the item.
itemDescription (string): Description of the item.
Example Request:

    ```json
        {
            "itemName": "Example Item",
            "itemPrice": 25.99,
            "itemCategory": "Electronics"
        }

Example Response (201 Created):

    ```json
        {
        "itemId": "unique-item-id",
        "itemName": "Example Item",
        "itemPrice": 25.99,
        "createdAt": "2023-09-04T12:00:00.000Z",
        "itemCategory": "Electronics"
        }

### Get All Items

- Endpoint: GET /item/fetch

- Description: Retrieve a list of items with optional filtering, sorting, and pagination.

- Query Parameters:

minPrice (number): Filter by minimum item price.
maxPrice (number): Filter by maximum item price.
itemName (string): Filter by item name (case-insensitive).
itemCategory (string): Filter by item category (case-insensitive).
sort (string): Sort items by price ("highToLow" or "lowToHigh").
page (number): Page number for pagination (default is 1).
pageSize (number): Number of items per page (default is 10).

- Example Request:

Retrieve all items in the "Electronics" category with prices between $20 and $50, sorted by price high to low, on page 2 with 10 items per page:

    ```bash
        GET /item/fetch?itemCategory=Grocery&minPrice=20&maxPrice=50&sort=highToLow&page=2&pageSize=10

Example Response (200 OK):

    ```json
        {
        "totalItems": 8,
        "page": 1,
        "pageSize": 10,
        "items": [
            {
                "itemId": "a22313d7-fc34-42d1-a90f-11362c6c8be4",
                "itemName": "Suger",
                "itemPrice": 40,
                "createdAt": "2023-09-04T19:46:12.664Z",
                "itemCategory": "Grocery",
                "itemDescription": "This item comes with seal package with 1KG quantity"

            },
            // More items...
        ]
        }

### Get an Item by ID

- Endpoint: GET /item/fetch/:id

- Description: Retrieve an item by its unique ID.

- Example Request:

Retrieve an item with ID "item-id-1":

    ```bash
        GET /items/a22313d7-fc34-42d1-a90f-11362c6c8be4

Example Response (200 OK):

    ```json
        {
            "itemId": "a22313d7-fc34-42d1-a90f-11362c6c8be4",
            "itemName": "Suger",
            "itemPrice": 40,
            "createdAt": "2023-09-04T19:46:12.664Z",
            "itemCategory": "Grocery",
            "itemDescription": "This item comes with seal package with 1KG quantity"
        }

### Update an Item by ID

- Endpoint: PUT /items/:id

- Description: Update an item by its unique ID.

- Request Body: Include the fields you want to update (e.g., itemName, itemPrice, itemCategory).

Example Request:

Update the price of an item with ID "a22313d7-fc34-42d1-a90f-11362c6c8be4":

    ```json
        {
            "itemPrice": 59.99
        }

Example Response (200 OK):

    ```json
        {
            "itemId": "a22313d7-fc34-42d1-a90f-11362c6c8be4",
            "itemName": "Suger",
            "itemPrice": 59.99,
            "createdAt": "2023-09-04T19:46:12.664Z",
            "itemCategory": "Grocery",
            "itemDescription": "This item comes with seal package with 1KG quantity"
        }

### Delete an Item by ID

- Endpoint: DELETE /item/delete/:id

- Description: Delete an item by its unique ID.

Example Request:

Delete an item with ID "item-id-1":
bash

DELETE /item/delete/a22313d7-fc34-42d1-a90f-11362c6c8be4
Example Response (200 OK):


## Error Handling

In case of errors, the API will return appropriate HTTP status codes and JSON responses with error messages:

400 Bad Request: The request is malformed or missing required fields.
404 Not Found: The requested resource does not exist.
500 Internal Server Error: An unexpected error occurred on the server.

## Validation

- Validation of request data is performed using the Joi library to ensure that the data meets the required format and constraints.

## Testing

You can run tests for the API using the Mocha testing framework and Chai assertion library.

- Test command

    ```bash
        npm run test

- API Tests

    POST /item/add
POST /item/add 201 12.561 ms - 257
      ✔ should add a new item (103ms)
    GET /item/fetch/:id
GET /item/fetch/21ef4399-7d7e-4e4c-919a-a5f76c24f71a 200 4.471 ms - 261
      ✔ should retrieve an item by ID
GET /item/fetch/invalid_id 404 1.128 ms - 54
      ✔ should return a 404 status if item ID is not found
    PUT /item/update/:id
PUT /item/update/21ef4399-7d7e-4e4c-919a-a5f76c24f71a 200 3.541 ms - 273
      ✔ should update an item by ID
PUT /item/update/invalid_id 404 2.125 ms - 54
      ✔ should return a 404 status if item ID is not found
    GET /item/fetch
GET /item/fetch?minPrice=15 200 1.425 ms - 2006
      ✔ should filter items by minimum price
GET /item/fetch?sort=highToLow 200 0.929 ms - 1995
      ✔ should sort items by price (high to low)
GET /item/fetch?page=2&pageSize=5 200 0.889 ms - 1096
      ✔ should paginate items
    DELETE /item/delete/:id
DELETE /item/delete/21ef4399-7d7e-4e4c-919a-a5f76c24f71a 200 3.453 ms - 64
      ✔ should delete an item by ID
DELETE /item/delete/invalid_id 404 3.899 ms - 54
      ✔ should return a 404 status if item ID is not found