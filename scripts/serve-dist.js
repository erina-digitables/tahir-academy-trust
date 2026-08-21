#!/usr/bin/env node
// Serves the built dist/ output, so the deployable artefact can be checked
// before it ships rather than only the working tree.

const path = require('path');

process.env.SERVE_ROOT = path.join(__dirname, '..', 'dist');
process.env.SERVE_PORT = process.env.SERVE_PORT || '3100';

require('./serve.js');
