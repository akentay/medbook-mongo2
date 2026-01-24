const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../database/mongo');

const router = express.Router();

// helper: build filter, sort, projection from query
function buildQueryOptions(query) {
  const filter = {};
  const sort = {};
  let projection = null;

  // filtering
  if (query.doctor) filter.doctorName = query.doctor;
  if (query.patient) filter.patientName = query.patient;

  // sorting: ?sort=date or ?sort=-date,doctorName
  if (query.sort) {
    const parts = query.sort.split(',');
    parts.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('-')) {
        sort[trimmed.slice(1)] = -1;
      } else {
        sort[trimmed] = 1;
      }
    });
  }

  // projection: ?fields=patientName,doctorName,date
  if (query.fields) {
    projection = {};
    query.fields.split(',').forEach((f) => {
      const key = f.trim();
      if (key) projection[key] = 1;
    });
  }

  return { filter, sort, projection };
}

// GET /api/appointments  (with filtering/sorting/projection)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('appointments');

    const { filter, sort, projection } = buildQueryOptions(req.query);

    let cursor = collection.find(filter);

    if (projection) cursor = cursor.project(projection);
    if (Object.keys(sort).length > 0) cursor = cursor.sort(sort);

    const result = await cursor.toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error('GET /api/appointments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDb();
    const collection = db.collection('appointments');

    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(doc);
  } catch (err) {
    console.error('GET /api/appointments/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/appointments
router.post('/', async (req, res) => {
  const { patientName, doctorName, date } = req.body;

  if (!patientName || !doctorName || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = getDb();
    const collection = db.collection('appointments');

    const result = await collection.insertOne({ patientName, doctorName, date });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    console.error('POST /api/appointments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/appointments/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { patientName, doctorName, date } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  if (!patientName || !doctorName || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = getDb();
    const collection = db.collection('appointments');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { patientName, doctorName, date } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('PUT /api/appointments/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDb();
    const collection = db.collection('appointments');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/appointments/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
