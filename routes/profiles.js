const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all profiles' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `Show profile ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Create new profile' });
});

router.put('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Update profile ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete profile ${req.params.id}` });
});

module.exports = router;
