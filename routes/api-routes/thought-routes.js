const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThought,
    updateThoughtById,
    removeThoughtById,
    createReaction,
    removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// /api/thoughts/:thoughtId

router
.route('/:thoughtId')
.get(getThoughtsById)
.put(updateThoughtById)
.delete(removeThoughtById);


router.route('/:thoughtId/reactions').post(createReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);


module.exports = router;