const router = require('express').Router();

const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router
  .route('/')
  .get(getAllThought)
  .post(createThought)

// /api/thoughts/<userId>
router
  .route('/:userId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/<userId>/<thoughtId>
router
  .route('/:userId/:thoughtId')
  .post(addReaction)
  .delete(deleteThought);

// /api/thoughts/<userId>/<thoughtId>/<reactionId>
router
  .route('/:userId/:thoughtId/:reactionId')
  .delete(deleteReaction);

module.exports = router;
