const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Load Note model
const Note = require("../../models/Notes.js");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://bananaco.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'wattIvPVEm2TSZV0lKxrY65uTtz6VM1o',
  issuer: `https://bananaco.auth0.com/`,
  algorithms: ['RS256']
});

// retrieve all notes
router.get('/', (req, res) => {
  const ns = notes.map(n => ({
    id: n.id,
    title: n.title,
    description: n.description,
    answers: n.answers.length,
  }));
  res.send(ns);
});

// get a specific note
router.get('/:id', (req, res) => {
  const note = notes.filter(n => (n.id === parseInt(req.params.id)));
  if (note.length > 1) return res.status(500).send();
  if (note.length === 0) return res.status(404).send();
  res.send(note[0]);
});

// insert a new note
router.post('/', checkJwt, (req, res) => {
  const {title, description} = req.body;
  const newQuestion = {
    id: notes.length + 1,
    title,
    description,
    answers: [],
    author: req.user.name,
  };
  notes.push(newQuestion);
  res.status(200).send();
});

// insert a new answer to a note
router.post('/answer/:id', checkJwt, (req, res) => {
  const {answer} = req.body;

  const note = notes.filter(n => (n.id === parseInt(req.params.id)));
  if (note.length > 1) return res.status(500).send();
  if (note.length === 0) return res.status(404).send();

  note[0].answers.push({
    answer,
    author: req.user.name,
  });

  res.status(200).send();
});

module.exports = router;
