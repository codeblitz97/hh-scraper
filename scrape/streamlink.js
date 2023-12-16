const { BaseURL } = require('../config');
const fs = require('fs');
const uae = require('user-agent-array');

const ua = uae[(Math.random() * uae.length) | 0];

const getStreamLink = async (watchId) => {
  return { watchId };
};

module.exports = { getStreamLink };
