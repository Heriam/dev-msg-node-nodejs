/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

'use strict';
let JSRequest = require('./../../../modules/JSRequest');

class RegistryConnector {
    constructor(registryURL, registry) {
      this.request = new JSRequest();
      this.registryURL = registryURL;
      this.registry = registry;
      this.logger = this.registry.getLogger();
    }

    processMessage(msg, callback) {
      let body = msg.getBody();
      switch (msg.getType().toLowerCase()) {
        case 'read':
          this.logger.info('[Registry-Connector] Get user with ' + body.resource);
          this.getUser(body.resource, callback);
        break;

        case 'create':
          this.logger.info('[Registry-Connector] Add hyperty with ' + body.value.hypertyURL);
          this.addHyperty(body.value.user, body.value.hypertyURL, body.value.hypertyDescriptorURL, callback);
        break;

        case 'delete':
          this.logger.info('[Registry-Connector] Delete hyperty with ' + body.value.hypertyURL);
          this.deleteHyperty(body.value.user, body.value.hypertyURL, callback);
        break;
      }
    }

    getUser(userid, callback) {
      let _this = this;
      this.request.get(this.registryURL + '/hyperty/user/' + encodeURIComponent(userid), function(err, response, statusCode) {
        _this.logger.info('Get user: ' + response);

        let body = {
            code: statusCode,
            value: response
          };

        callback(body);
      });
    }

    addHyperty(userid, hypertyid, hypertyDescriptor, callback) {
      let _this = this;
      let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);
      let data = { descriptor: hypertyDescriptor };
      this.logger.debug('addHyperty', this.registryURL + endpoint);
      this.request.put(this.registryURL + endpoint, JSON.stringify(data), function(err, response, statusCode) {
        _this.logger.debug('Domain registry response:', response);
        if (err) {
          _this.logger.error('Domain registry error: ', err);
        }

        let body = {
          code: statusCode
        };

        callback(body);
      });
    }

    deleteHyperty(userid, hypertyid, callback) {
      let _this = this;
      let endpoint = '/hyperty/user/' + encodeURIComponent(userid) + '/' + encodeURIComponent(hypertyid);

      this.request.del(this.registryURL + endpoint, function(err, response, statusCode) {
        _this.logger.info('Delete hyperty: ' + response);

        let body = {
          code: statusCode
        };

        callback(body);
      });
    }
}
module.exports = RegistryConnector;
