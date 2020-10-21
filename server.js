/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const apiController = require('./api/controller.js');
const config = require('./webpack.config.js');
const express = require('express');
const middleware = require('webpack-dev-middleware');
const webpack = require('webpack');

const app = express();
const compiler = webpack(config);

app.use(express.static('public'));
app.use(middleware(compiler, {
    publicPath: config.output.publicPath
  })
);
app.use('/api/', apiController);
app.get("*", function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

var listener = app.listen(3000, function () {
  console.log('* your app is listening on port ' + listener.address().port);
});
