const Event = require('../models/eventModels');

// Add Event Controller
const addEvent = async (req, res) => {
  try {
    const { title, desc, imglink, count, location } = req.body;

    // Create a new event using the create method
    const newEvent = await Event.create({
      title,
      desc,
      imglink,
      count,
      location
    });

    res.status(200).json({
      message: 'Event added successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(400).json({
      message: 'Failed to add event',
      error: error.message
    });
  }
};


module.exports = { addEvent }