const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Timeline = require('../models/Timeline');

// GET /api/timeline
router.get('/', auth, async (req, res) => {
  try {
    const events = await Timeline.find({ user: req.user.id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/timeline
router.post('/', [auth, [check('title', 'Title is required').not().isEmpty(), check('date', 'Date is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, date, description } = req.body;
    const event = new Timeline({ user: req.user.id, title, date, description });
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/timeline/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Timeline.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    if (event.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await event.remove();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
