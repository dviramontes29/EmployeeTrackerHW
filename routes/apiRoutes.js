const router = require('express').Router()
const db = require('../db')

// GET all items
router.get('/employee', (req, res) => {
    db.query('SELECT * FROM employees', (err, employees) => {
        if (err) { console.log(err) }
        res.json(employees)
    })
})
router.post('/employee', (req, res) => {
    db.query('INSERT INTO employees SET ?', req.body, (err, fields) => {
        if (err) { console.log(err) }

    })
})
router.put('/employee/:id', (req, res) => {
    db.query('UPDATE employees SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?  WHERE id = ?', [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id, req.params.id], (err, fields) => {
        if (err) { console.log(err) }

    })
})
router.delete('/employee/:id', (req, res) => {
    db.query('DELETE FROM employees WHERE id = ?', req.params.id, (err, fields) => {
        if (err) { console.log(err) }

    })
})
module.exports = router