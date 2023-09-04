# Product Management

Project Description: A Node.js CRUD API using Express and JSON file storage.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Data Schema](#data-schema)
- [Error Handling](#error-handling)
- [Installation](#installation)

## Project Overview

This project is a Node.js CRUD (Create, Read, Update, Delete) API built using the Express.js framework and JSON files for data storage. It allows you to manage items with properties such as `itemName`, `itemPrice`, `createdAt`, `itemCategory`, and `itemId`.

## Prerequisites

- Node.js and npm installed on your machine.
- Knowledge of RESTful API concepts.

## Usage

- Make API requests using tools like Postman, curl, or build a frontend application to interact with the CRUD operations.
- Modify the code and data schema according to your specific project requirements.

## API Routes

- POST /items: Create a new item.
- GET /items: Retrieve a list of items with optional filtering, sorting, and pagination.
- GET /items/:id: Retrieve an item by its ID.
- PUT /items/:id: Update an item by its ID.
- DELETE /items/:id: Delete an item by its ID.
- For detailed usage examples and query parameters, refer to the API documentation.

## Error Handling
- The API includes error handling using try-catch blocks to provide informative error responses.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dhreetiman/product-management.git/
   cd product-management
