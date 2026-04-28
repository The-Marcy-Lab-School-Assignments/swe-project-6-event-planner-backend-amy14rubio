const rsvpModel = require('../models/rsvpModel');

// GET /api/users/:user_id/rsvps
const listUserRsvps = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    const events = await rsvpModel.listByUser(userId);
    res.send(events);
  } catch (err) {
    next(err);
  }
};

// POST /api/events/:event_id/rsvps
const createRsvp = async (req, res, next) => {
  try {
    const eventId = Number(req.params.event_id);
    const rsvp = await rsvpModel.create(req.session.userId, eventId);
    if (!rsvp) return res.status(200).send(true); //already exists
    res.status(201).send(rsvp);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:event_id/rsvps
const deleteRsvp = async (req, res, next) => {
  try {
    const eventId = Number(req.params.event_id);
    const rsvp = await rsvpModel.destroy(req.session.userId, eventId);
    res.send(rsvp);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUserRsvps,
  createRsvp,
  deleteRsvp,
};
