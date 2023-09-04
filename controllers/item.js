const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // To generate unique itemIds
const Joi = require('joi');

// Load data from the JSON file
const loadData = () => {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
};

// Save data to the JSON file
const saveData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Joi schema for validating request body
const itemSchema = Joi.object({
    itemName: Joi.string(),
    itemPrice: Joi.number().min(0),
    createdAt: Joi.string().isoDate(),
    itemCategory: Joi.string(),
    itemId: Joi.string(),
    itemDescription: Joi.string()
});


/**
 * Adds a new item to the JSON file.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The response object.
 */
exports.addNewItem = (req, res) => {
    try {

        const data = loadData();
        let { itemName, itemPrice, itemCategory, itemDescription, ...rest } = req.body
        if (!itemName || !itemPrice || !itemCategory || !itemDescription) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required fields',
                data: {}
            })
        }
        if (Object.keys(rest).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide only the required fields',
                data: {}
            })
        }

        const newItem = {
            itemId: uuidv4(), // Generate a unique itemId
            itemName: req.body.itemName,
            itemPrice: req.body.itemPrice,
            createdAt: new Date().toISOString(),
            itemCategory: req.body.itemCategory,
            itemDescription: req.body.itemDescription
        };

        const { error } = itemSchema.validate(newItem);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {}
            });
        }

        data.items.push(newItem);
        saveData(data);
        return res.status(201).json({
            success: true,
            message: 'Item added successfully',
            data: newItem
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        })
    }
}

/**
 * Retrieves items based on the provided query parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The response object containing the filtered and paginated items.
 */

exports.getItems = (req, res) => {
    try {

        const data = loadData();
        let filteredItems = [...data.items];

        // Filtering by minimum item price
        if (req.query.minPrice) {
            const minPrice = parseFloat(req.query.minPrice);
            filteredItems = filteredItems.filter((item) => item.itemPrice >= minPrice);
        }

        // Filtering by maximum item price
        if (req.query.maxPrice) {
            const maxPrice = parseFloat(req.query.maxPrice);
            filteredItems = filteredItems.filter((item) => item.itemPrice <= maxPrice);
        }

        // Filtering by item name (case-insensitive)
        if (req.query.itemName) {
            const itemNameFilter = req.query.itemName.toLowerCase();
            filteredItems = filteredItems.filter((item) =>
                item.itemName.toLowerCase().includes(itemNameFilter)
            );
        }

        // Filtering by item category (case-insensitive)
        if (req.query.itemCategory) {
            const categoryFilter = req.query.itemCategory.toLowerCase();
            filteredItems = filteredItems.filter((item) =>
                item.itemCategory.toLowerCase() === categoryFilter
            );
        }

        // Sorting by price (high to low)
        if (req.query.sort === 'highToLow') {
            filteredItems.sort((a, b) => b.itemPrice - a.itemPrice);
        }

        // Sorting by price (low to high)
        if (req.query.sort === 'lowToHigh') {
            filteredItems.sort((a, b) => a.itemPrice - b.itemPrice);
        }

        // Pagination (if provided in query parameters)
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        return res.status(200).json({
            success: true,
            message: 'Items retrieved successfully',
            data: {
                totalItems: filteredItems.length,
                page,
                pageSize,
                items: paginatedItems
            }
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        })
    }
}

/**
 * Retrieves an item by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The item object or an error message.
 */

exports.getItemById = (req, res) => {
    try {

        const data = loadData();
        const itemId = req.params.id;
        const item = data.items.find((item) => item.itemId === itemId);
        if (!item) {
            return res.status(404).send({
                success: false,
                message: 'Item not found',
                data: {}
            });
        } else {
            return res.json({
                success: true,
                message: 'Item retrieved successfully',
                data: item
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        })

    }
}

/**
 * Update an item in the JSON file.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The updated item or an error response.
 */

exports.updateItem = (req, res) => {
    try {

        const data = loadData();
        const itemId = req.params.id;
        const updatedItem = req.body;
        const itemIndex = data.items.findIndex((item) => item.itemId === itemId);
        const { error } = itemSchema.validate(updatedItem);
        let { itemName, itemPrice, itemCategory, itemDescription, ...rest } = req.body
        
        if (Object.keys(rest).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide only the required fields',
                data: {}
            })
        }
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
                data: {}
            });
        }
        if (itemIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Item not found',
                data: {}
            });
        } else {
            data.items[itemIndex] = {
                ...data.items[itemIndex],
                ...updatedItem,
            };
            saveData(data);
            return res.json({
                success: true,
                message: 'Item updated successfully',
                data: data.items[itemIndex]
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        })
    }
}

/**
 * Deletes an item from the JSON file.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The response object.
 */

exports.deleteItem = (req, res) => {
    try {

        const data = loadData();
        const itemId = req.params.id;
        const itemIndex = data.items.findIndex((item) => item.itemId === itemId);
        if (itemIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Item not found',
                data: {}
            });
        } else {
            data.items.splice(itemIndex, 1);
            saveData(data);
            return res.send({
                success: true,
                message: 'Item deleted successfully',
                data: {}
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        })

    }
}


