const router = require('express').Router()
let {
    addNewItem,
    getItems,
    updateItem,
    getItemById,
    deleteItem
} = require('../controllers/item')

router.post('/item/add', addNewItem)
router.get('/item/fetch', getItems)
router.get('/item/fetch/:id', getItemById)
router.put('/item/update/:id', updateItem)
router.delete('/item/delete/:id', deleteItem)

module.exports = router