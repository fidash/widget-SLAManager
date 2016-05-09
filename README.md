SLA Manager Widget
==================

[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/fidash/widget-SLAManager/master/LICENSE)
[![Support badge](https://img.shields.io/badge/support-askbot-yellowgreen.svg)](http://ask.fiware.org)
[![Build Status](https://build.conwet.fi.upm.es/jenkins/view/FI-Dash/job/Widget%20SLAManager/badge/icon)](https://build.conwet.fi.upm.es/jenkins/view/FI-Dash/job/Widget%20SLAManager/)

Build
-----

Be sure to have installed [Node.js](http://node.js)
in your system. For example, you can install it on Ubuntu and Debian running the
following commands:

```bash
sudo apt-get install nodejs
sudo apt-get install npm
```

Install other npm dependencies by running:

```bash
npm install
```

For build the widget you need download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `dist` folder.

Settings and Usage
------------------

### Preferences

- **SLA Manager URL**: URL of the SLA Manager server.
- **User**: User for authenticating with the SLA server.
- **Password**: User for authenticating with the SLA server.

### Wiring

#### Input Endpoints:

N/A

#### Output Endpoints:

N/A

Copyright and License
---------------------

Copyright 2012-2015 CoNWeT Lab., Universidad Politecnica de Madrid

This project is part of [FIWARE](https://www.fiware.org/). This widget is part of FI-Dash component included in FIWARE.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
