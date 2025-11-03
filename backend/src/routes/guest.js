const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Guest = require('../models/Guest');

// GET /api/guests
router.get('/', auth, async (req, res) => {
  try {
    const guests = await Guest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(guests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/guests
router.post('/', [auth, [check('name', 'Name is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, phone, plusOne, confirmed } = req.body;
    const guest = new Guest({ user: req.user.id, name, email, phone, plusOne, confirmed });
    await guest.save();
    res.json(guest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PATCH /api/guests/:id
router.patch('/:id', auth, async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ msg: 'Guest not found' });
    if (guest.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    Object.assign(guest, req.body);
    await guest.save();
    res.json(guest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/guests/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ msg: 'Guest not found' });
    if (guest.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await guest.remove();
    res.json({ msg: 'Guest removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
