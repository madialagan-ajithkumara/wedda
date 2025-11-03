const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Budget = require('../models/Budget');

// GET /api/budget - get all budget items for user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/budget - create budget item
router.post('/', [auth, [check('title', 'Title is required').not().isEmpty(), check('amount', 'Amount is required').isNumeric()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, amount, category } = req.body;
    const item = new Budget({ user: req.user.id, title, amount, category });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/budget/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Budget.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    if (item.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await item.remove();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
