/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');

require('./config.js');
var hfc = require('fabric-client');

var helper = require('./app/helper.js');
var createChannel = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');


logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************',host,port);


///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Register and enroll user


var username = 'Jim';
var orgName = 'Org1';
logger.debug('End point : /users');
logger.debug('User name : ' + username);
logger.debug('Org name  : ' + orgName);

let response = helper.getRegisteredUser(username, orgName, true);
logger.debug('-- returned from registering the username %s for organization %s',username,orgName);
if (response && typeof response !== 'string') {
	logger.debug('Successfully registered the username %s for organization %s',username,orgName);
	logger.debug('response :'+ response);
} else {
	logger.debug('Failed to register the username %s for organization %s with::%s',username,orgName,response);
}



logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
logger.debug('End point : /channels');
var channelName = 'mychannel';
var channelConfigPath = '../artifacts/channel/mychannel.tx';
logger.debug('Channel name : ' + channelName);
logger.debug('channelConfigPath : ' + channelConfigPath); //../artifacts/channel/mychannel.tx

let message = createChannel.createChannel(channelName, channelConfigPath, username, orgName);

logger.debug('message: ',message);