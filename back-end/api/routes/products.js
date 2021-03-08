const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
    res.status(200).json({
        messages: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        messages: 'Handling POST requests to /products'
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id == 'special') {
        res.status(200).json({
            message: 'Special',
            id: id
        })
    }
    else {
        res.status(200).json({
            message: 'Normal'
        })
    }
})

module.exports = router;