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
let Message = require('./../Message');
let uuid = require('uuid');

class AddressAllocationManager {
  constructor(name, registry) {
    this.registry = registry;
    this.name = name;
    this.baseURL = 'hyperty://' + this.registry.getDomain() + '/';
    this.logger = this.registry.getLogger();
  }

  getName() {
    return this.name;
  }

  handle(clientMessage) {
    let msg = clientMessage.getMessage();

    if (msg.getType() === 'create') {
      this.logger.info('[', this.getName(), '] handle create msg');
      let number = msg.getBody().value.number;
      let allocated = this.allocate(clientMessage, number);

      let reply = new Message();
      reply.setId(msg.getId());
      reply.setFrom(this.name);
      reply.setTo(msg.getFrom());
      reply.setType('response');
      reply.setReplyCode(200);
      reply.getBody().value = {};
      reply.getBody().value.allocated = allocated;

      clientMessage.reply(reply);
    }
  }

  allocate(clientMessage, number) {
    let list = [];
    let i;
    for (i = 0; i < number; i++) {
      let url = this.baseURL + uuid.v4();
      if (this.registry.allocate(url, clientMessage.getRuntimeUrl())) {
        list.push(url);
      }
    }

    this.logger.info('[' + this.getName() + '] allocate URLs', list);
    return list;
  }
}
module.exports = AddressAllocationManager;
