/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./components/bills/controller.js":
/*!****************************************!*\
  !*** ./components/bills/controller.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const store = __webpack_require__(/*! ./store */ \"./components/bills/store.js\");\n\nfunction getBills() {\n    return new Promise((resolve, reject) => {\n        resolve(store.list())\n    })\n}\n\nfunction getHistory() {\n    return new Promise((resolve, reject) => {\n        resolve(store.historyList())\n    })\n}\n\nfunction addPay(request) {\n    return new Promise((resolve, reject) => {\n        resolve(store.addPay(request))\n    })\n}\n\nfunction addBill(request) {\n    return new Promise((resolve, reject) => {\n        resolve(store.addBill(request))\n    })\n}\n\nfunction approvePay(request) {\n    return new Promise((resolve, reject) => {\n        resolve(store.approve(request))\n    })\n}\n\n\nmodule.exports = {\n    getBills,\n    addPay,\n    addBill,\n    getHistory,\n    approvePay\n}\n\n//# sourceURL=webpack://my-notes-backend/./components/bills/controller.js?");

/***/ }),

/***/ "./components/bills/model.js":
/*!***********************************!*\
  !*** ./components/bills/model.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nconst Schema = mongoose.Schema;\n\nconst billsSchema = new Schema({\n\tvalue: String,\n\tdate: String,\n\tmoney: String,\n    owner: String,\n    extra: String,\n\tstatus: String\n});\n\nconst model = mongoose.model(\"bills\", billsSchema);\n\nmodule.exports = model;\n\n\n//# sourceURL=webpack://my-notes-backend/./components/bills/model.js?");

/***/ }),

/***/ "./components/bills/network.js":
/*!*************************************!*\
  !*** ./components/bills/network.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst controller = __webpack_require__(/*! ./controller */ \"./components/bills/controller.js\");\nconst passport = __webpack_require__(/*! passport */ \"passport\");\n\nrouter.get(\"/bills\", (req, res) => {\n\tcontroller\n\t\t.getBills()\n\t\t.then((billList) => {\n\t\t\t// console.log(billList);\n\t\t\tres.send(billList);\n\t\t})\n\t\t.catch((error) => console.log(error));\n});\n\nrouter.get(\n\t\"/bills-auth\",\n\tpassport.authenticate(\"jwt\", { session: false }),\n\t(req, res) => {\n\t\tcontroller\n\t\t\t.getBills()\n\t\t\t.then((billList) => {\n\t\t\t\t// console.log(billList);\n\t\t\t\tres.send(billList);\n\t\t\t})\n\t\t\t.catch((error) => console.log(error));\n\t}\n);\n\nrouter.get(\"/bill-history\", (req, res) => {\n\tcontroller\n\t\t.getHistory()\n\t\t.then((history) => res.send(history))\n\t\t.catch((err) => console.log(err));\n});\n\nrouter.post(\"/add-pay\", (req, res) => {\n\tcontroller\n\t\t.addPay(req.body)\n\t\t.then((response) => res.send(response))\n\t\t.catch((err) => console.log(err));\n});\n\nrouter.post(\"/approve-pay\", (req, res) => {\n\tcontroller\n\t\t.approvePay(req.body)\n\t\t.then((response) => res.send(response))\n\t\t.catch((err) => console.log(err));\n});\n\nrouter.post(\"/add-bill\", (req, res) => {\n\tcontroller\n\t\t.addBill(req.body)\n\t\t.then(() => res.send(\"bill added\"))\n\t\t.catch((err) => console.log(err));\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack://my-notes-backend/./components/bills/network.js?");

/***/ }),

/***/ "./components/bills/store.js":
/*!***********************************!*\
  !*** ./components/bills/store.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Model = __webpack_require__(/*! ./model */ \"./components/bills/model.js\");\nconst BillUtils = __webpack_require__(/*! ../../utils/billUtils */ \"./utils/billUtils.js\")\nconst NoteModel = __webpack_require__(/*! ../notes/model */ \"./components/notes/model.js\")\nconst response = __webpack_require__(/*! ../../network/response */ \"./network/response.js\")\n\nasync function getBills() {\n    const bills = await Model.find()\n    return bills\n}\n\nasync function addPay(request) {\n    const filter = {_id: request.id}\n    const bill = await Model.findOne(filter)\n    let updateValue;\n    let status = \"pending\"\n    if(request.concept === \"credit\"){\n        const sum = parseInt(bill.value) + parseInt(request.value)\n        updateValue = sum\n        status = \"approved\"\n        await Model.findByIdAndUpdate(request.id, { $set: { value: sum } }, { useFindAndModify: false })\n    }else {\n        const substract = bill.value - request.value\n        updateValue = substract\n        await Model.findByIdAndUpdate(request.id, { $set: { value: substract } }, { useFindAndModify: false })\n    }\n    const updatedBill = { ...bill, value: updateValue }\n    const ticket = BillUtils.generateTicket(updatedBill._doc, request.concept, request.value, status)\n    const newTicket = new NoteModel(ticket)\n    newTicket.save()\n    return updatedBill._doc\n}\n\nasync function historyList () {\n    return await NoteModel.find({ color: \"ticket\" }).sort({_id: 'desc'})\n}\n\nasync function addBill(request) {\n    const bill = {\n        value: request.value,\n        date: request.date,\n        money: request.money,\n        owner: request.owner,\n        extra: request.extra,\n        status: request.status\n    }\n    const newBill = new Model(bill)\n    newBill.save()\n    return newBill\n}\n\nasync function approve(request) {\n    const filter = {_id: request.id}\n    const ticket = await NoteModel.findOne(filter)\n    if(request.status === \"Aprobar\"){\n        const processTicket = BillUtils.approveTicket(ticket, \"aprobado\")\n        return await NoteModel.updateOne(filter, processTicket, response.handleError())\n    }else {\n        const bill = await Model.findOne({ _id: ticket.footer })\n        const sum = parseInt(bill.value) + parseInt(request.value)\n        await Model.findByIdAndUpdate(request.id, { $set: { value: sum } }, { useFindAndModify: false })\n        const processTicket = BillUtils.approveTicket(ticket, \"rechazado\")\n        return await NoteModel.updateOne(filter, processTicket, response.handleError())\n    }\n}\n\nmodule.exports = {\n    list: getBills,\n    addPay,\n    addBill,\n    historyList,\n    approve\n}\n\n//# sourceURL=webpack://my-notes-backend/./components/bills/store.js?");

/***/ }),

/***/ "./components/notes/controller.js":
/*!****************************************!*\
  !*** ./components/notes/controller.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const store = __webpack_require__(/*! ./store */ \"./components/notes/store.js\");\n\nfunction getNotes() {\n\treturn new Promise((resolve, reject) => {\n\t\tresolve(store.list());\n\t});\n}\n\nfunction addNote(request) {\n\tconsole.log(request);\n\treturn new Promise((resolve, reject) => {\n\t\tresolve(store.add(request));\n\t});\n}\n\nfunction editNote(request) {\n\tconsole.log(request)\n\treturn new Promise((resolve, reject) => {\n\t\tresolve(store.edit(request))\n\t})\n}\n\nfunction deleteNote(request) {\n\treturn new Promise((resolve, reject) => {\n\t\tresolve(store.delete(request))\n\t})\n}\n\nmodule.exports = {\n\tgetNotes,\n\taddNote,\n\teditNote,\n\tdeleteNote\n};\n\n\n//# sourceURL=webpack://my-notes-backend/./components/notes/controller.js?");

/***/ }),

/***/ "./components/notes/model.js":
/*!***********************************!*\
  !*** ./components/notes/model.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nconst Schema = mongoose.Schema;\n\nconst noteSchema = new Schema({\n\ttitle: String,\n\tbody: String,\n\tfooter: String,\n});\n\n//add color note\nnoteSchema.add({\n\tcolor: String,\n})\n\nnoteSchema.add({\n\tappend: Object,\n})\n\nconst model = mongoose.model(\"notes\", noteSchema);\n\nmodule.exports = model;\n\n\n//# sourceURL=webpack://my-notes-backend/./components/notes/model.js?");

/***/ }),

/***/ "./components/notes/network.js":
/*!*************************************!*\
  !*** ./components/notes/network.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst controller = __webpack_require__(/*! ./controller */ \"./components/notes/controller.js\");\n\nrouter.get(\"/\", (req, res) => {\n\tcontroller\n\t\t.getNotes()\n\t\t.then((notesList) => {\n\t\t\t// console.log(notesList);\n\t\t\tres.send(notesList);\n\t\t})\n\t\t.catch((error) => console.log(error));\n});\n\nrouter.post(\"/note\", (req, res) => {\n\tcontroller\n\t\t.addNote(req.body)\n\t\t.then((respose) => {\n\t\t\tconsole.log(\"guardados correctamente\");\n\t\t\tres.send(\"datos guardados\");\n\t\t})\n\t\t.catch((error) => console.log(error));\n});\n\nrouter.put(\"/edit-note\", (req, res) => {\n\t//do it something\n\tcontroller\n\t\t.editNote(req.body)\n\t\t\t.then(response => {\n\t\t\t\tconsole.log('nota actualizada')\n\t\t\t\tres.send(\"nota actualizada\")\n\t\t\t})\n\t\t\t.catch(err => console.log(err))\n})\n\nrouter.delete(\"/delete\", (req, res) => {\n\tcontroller\n\t\t.deleteNote(req.body)\n\t\t\t.then(response => {\n\t\t\t\tconsole.log(\"nota eliminada\");\n\t\t\t\tres.send(\"nota eliminada\")\n\t\t\t})\n\t\t\t.catch(err => console.log(err))\n})\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack://my-notes-backend/./components/notes/network.js?");

/***/ }),

/***/ "./components/notes/store.js":
/*!***********************************!*\
  !*** ./components/notes/store.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Model = __webpack_require__(/*! ./model */ \"./components/notes/model.js\");\nconst response = __webpack_require__(/*! ../../network/response */ \"./network/response.js\")\n\nasync function getNotes() {\n\tconst notes = await Model.find();\n\treturn notes;\n}\n\nasync function addNote(request) {\n\tconsole.log(request);\n\tconst newNote = new Model(request);\n\tnewNote.save();\n}\n\nasync function setNote(request) {\n\tconst id = {_id: request._id}\n\tconst newData = {\n\t\ttitle: request.title,\n\t\tbody: request.body,\n\t\tfooter: request.footer,\n\t\tcolor: request.color\n\t}\n\tModel.updateOne(id, newData, response.handleError)\n}\n\nasync function deleteNote(request) {\n\tModel.findOneAndDelete(request, null, response.handleError)\n}\n\nmodule.exports = {\n\tlist: getNotes,\n\tadd: addNote,\n\tedit: setNote,\n\tdelete: deleteNote\n};\n\n\n//# sourceURL=webpack://my-notes-backend/./components/notes/store.js?");

/***/ }),

/***/ "./components/users/controller.js":
/*!****************************************!*\
  !*** ./components/users/controller.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const store = __webpack_require__(/*! ./store */ \"./components/users/store.js\")\n\nfunction login(request) {\n    return new Promise((resolve, reject) => {\n        resolve(store.checkLogin(request))\n    })\n}\n\nfunction register(request) {\n    return new Promise((resolve, reject) => {\n        resolve(store.add(request))\n    })\n}\n\nfunction getUsers() {\n    return new Promise((resolve, reject) => {\n        resolve(store.list())\n    })\n}\n\nmodule.exports = {\n    login,\n    register,\n    getUsers\n}\n\n//# sourceURL=webpack://my-notes-backend/./components/users/controller.js?");

/***/ }),

/***/ "./components/users/model.js":
/*!***********************************!*\
  !*** ./components/users/model.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\n\nconst Schema = mongoose.Schema\n\nconst userSchema = new Schema({\n    username: String,\n    email: String,\n    password: String,\n    role: String\n})\n\nuserSchema.add({\n    country: String\n})\n\nconst model = mongoose.model(\"users\", userSchema)\n\nmodule.exports = model\n\n//# sourceURL=webpack://my-notes-backend/./components/users/model.js?");

/***/ }),

/***/ "./components/users/network.js":
/*!*************************************!*\
  !*** ./components/users/network.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst router = express.Router();\nconst controller = __webpack_require__(/*! ./controller.js */ \"./components/users/controller.js\");\nconst { checkApiKey } = __webpack_require__(/*! ../../middleware/auth.handler */ \"./middleware/auth.handler.js\");\nconst passport = __webpack_require__(/*! passport */ \"passport\");\n\nrouter.post(\n\t\"/login\",\n\tpassport.authenticate(\"local\", { session: false }),\n\t(req, res) => {\n\t\tcontroller\n\t\t\t.login(req.body)\n\t\t\t.then((authToken) => {\n\t\t\t\tres.json(authToken)\n\t\t\t})\n\t\t\t.catch((e) => console.log(e));\n\t}\n);\n\nrouter.post(\"/signup\", (req, res) => {\n\tcontroller\n\t\t.register(req.body)\n\t\t.then((auth) => {\n\t\t\tconsole.log(auth);\n\t\t\tres.send(auth);\n\t\t})\n\t\t.catch((e) => console.log(e));\n});\n\nrouter.get(\"/customers\", checkApiKey, (req, res) => {\n\tcontroller\n\t\t.getUsers()\n\t\t.then((userList) => res.send(userList))\n\t\t.catch((err) => console.log(err));\n});\n\nmodule.exports = router;\n\n\n//# sourceURL=webpack://my-notes-backend/./components/users/network.js?");

/***/ }),

/***/ "./components/users/store.js":
/*!***********************************!*\
  !*** ./components/users/store.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Model = __webpack_require__(/*! ./model */ \"./components/users/model.js\")\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\")\nconst config = __webpack_require__(/*! ../../config */ \"./config/index.js\")\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\")\nconst { signToken } = __webpack_require__(/*! ../../middleware/auth.handler */ \"./middleware/auth.handler.js\")\n\nasync function getUsers() {\n    const users = await Model.find()\n    return users\n}\n\nasync function add(request) {\n    const user = {\n        username: request.username,\n        email: request.email,\n        password: await bcrypt.hash(request.password, 10),\n        role: request.role || 'user',\n        country: request.country || 'col'\n    }\n\n    const newUser = new Model(user)\n    newUser.save()\n    return newUser\n}\n\nasync function checkLogin(request) {\n    const userFilter = {username: request.username}\n    // console.log(userFilter);\n    const user = await Model.findOne(userFilter)\n    \n    const payload = {\n        sub: user._id,\n        role: user.role\n    }\n\n    return { user, token: signToken(payload, config.secret) }\n}\n\nmodule.exports = {\n    add: add,\n    checkLogin: checkLogin,\n    list: getUsers\n}\n\n//# sourceURL=webpack://my-notes-backend/./components/users/store.js?");

/***/ }),

/***/ "./config/database.js":
/*!****************************!*\
  !*** ./config/database.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const db = __webpack_require__(/*! mongoose */ \"mongoose\");\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)()\n\nconst uri = process.env.DATABASE_URL\n\ndb.Promise = global.Promise;\n\ndb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })\n\t.then(() => console.log(`base de datos conectada con exito`))\n\t.catch((err) => console.error(`error al conectar la base de datos: ${err}`));\n\n\n//# sourceURL=webpack://my-notes-backend/./config/database.js?");

/***/ }),

/***/ "./config/index.js":
/*!*************************!*\
  !*** ./config/index.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("(__webpack_require__(/*! dotenv */ \"dotenv\").config)()\n__webpack_require__(/*! ./database */ \"./config/database.js\")\n\nmodule.exports = {\n\tport: process.env.PORT || 3001,\n\thost: process.env.HOST || \"http://localhost\",\n\tdbUri: process.env.DATABASE_URL,\n\t//user admin\n\tusername: \"lalo\",\n\tpassword: \"landa\",\n\temail: \"me@me.com\",\n\tsecret: process.env.SECRET_TOKEN || \"my-notes-back\",\n\tapiKey: process.env.API_KEY || 'no-key'\n};\n\n\n//# sourceURL=webpack://my-notes-backend/./config/index.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils_noteUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/noteUtils */ \"./utils/noteUtils.ts\");\n\n\nconst config = __webpack_require__(/*! ./config */ \"./config/index.js\");\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nconst routesNotes = __webpack_require__(/*! ./components/notes/network */ \"./components/notes/network.js\");\nconst routesUsers = __webpack_require__(/*! ./components/users/network */ \"./components/users/network.js\")\nconst routesBills = __webpack_require__(/*! ./components/bills/network */ \"./components/bills/network.js\")\nconst cors = __webpack_require__(/*! cors */ \"cors\");\nconst app = express__WEBPACK_IMPORTED_MODULE_0___default()();\nconst router = __webpack_require__(/*! ./network/routes */ \"./network/routes.js\")\nconst passport = __webpack_require__(/*! passport */ \"passport\")\n\n_utils_noteUtils__WEBPACK_IMPORTED_MODULE_1__.NoteUtils.testTypescritp()\n\napp.use(cors());\n\napp.use(passport.initialize())\n__webpack_require__(/*! ./utils/auth */ \"./utils/auth/index.js\")\n\napp.use(bodyParser.json());\napp.use(routesNotes);\napp.use(routesUsers)\napp.use(routesBills)\n\n//server on\napp.listen(config.port, () => {\n\tconsole.log(`escuchando en el puerto ${config.host}:${config.port}`);\n});\n\n\n//# sourceURL=webpack://my-notes-backend/./index.js?");

/***/ }),

/***/ "./middleware/auth.handler.js":
/*!************************************!*\
  !*** ./middleware/auth.handler.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const boom = __webpack_require__(/*! @hapi/boom */ \"@hapi/boom\");\nconst config = __webpack_require__(/*! ../config */ \"./config/index.js\");\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n\nfunction checkApiKey(req, res, next) {\n    const apiKey = req.headers['api'];\n    if(apiKey === config.apiKey) {\n        next();\n    }else {\n        res.status(401)\n        res.send('sin autorizacion')\n    }\n}\n\nfunction checkUserToken(req, res, next) {\n    const token = req.headers['token']\n    if(verifyToken(token, config.secret)){\n        next()\n    }else {\n        res.status(401)\n        res.send('sin autorizacion')\n    }\n}\n\nfunction signToken(payload, secret) {\n    return jwt.sign(payload, secret)\n}\n\nfunction verifyToken(payload, secret) {\n    return jwt.verify(token, secret)\n}\n\nmodule.exports = { checkApiKey, checkUserToken, signToken };\n\n//# sourceURL=webpack://my-notes-backend/./middleware/auth.handler.js?");

/***/ }),

/***/ "./network/response.js":
/*!*****************************!*\
  !*** ./network/response.js ***!
  \*****************************/
/***/ ((module) => {

eval("//aqui se hace una funcion para mostrar respuestas del servidor\n\nconst handleError = (err, doc) => {\n    if (err) {\n        console.log(error)\n    }\n}\n\nmodule.exports = {\n    handleError\n}\n\n//# sourceURL=webpack://my-notes-backend/./network/response.js?");

/***/ }),

/***/ "./network/routes.js":
/*!***************************!*\
  !*** ./network/routes.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("//aqui se hace un redireccionador para simplificar el uso del archivo raiz\nconst express = __webpack_require__(/*! express */ \"express\")\nconst app = express()\n\nconst noteRoutes = __webpack_require__(/*! ../components/notes/network */ \"./components/notes/network.js\")\n\napp.use(noteRoutes)\n\n//# sourceURL=webpack://my-notes-backend/./network/routes.js?");

/***/ }),

/***/ "./utils/noteUtils.ts":
/*!****************************!*\
  !*** ./utils/noteUtils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.NoteUtils = void 0;\nclass NoteUtils {\n}\nexports.NoteUtils = NoteUtils;\nNoteUtils.testTypescritp = () => {\n    console.log('testing typescript');\n};\n\n\n//# sourceURL=webpack://my-notes-backend/./utils/noteUtils.ts?");

/***/ }),

/***/ "./utils/auth/index.js":
/*!*****************************!*\
  !*** ./utils/auth/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const passport = __webpack_require__(/*! passport */ \"passport\")\nconst JwtStrategy = __webpack_require__(/*! ./strategies/jwt.strategy */ \"./utils/auth/strategies/jwt.strategy.js\")\nconst LocalStrategy = __webpack_require__(/*! ./strategies/local.strategy */ \"./utils/auth/strategies/local.strategy.js\")\n\npassport.use(LocalStrategy)\npassport.use(JwtStrategy)\n\n//# sourceURL=webpack://my-notes-backend/./utils/auth/index.js?");

/***/ }),

/***/ "./utils/auth/strategies/jwt.strategy.js":
/*!***********************************************!*\
  !*** ./utils/auth/strategies/jwt.strategy.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { Strategy, ExtractJwt } = __webpack_require__(/*! passport-jwt */ \"passport-jwt\")\nconst config = __webpack_require__(/*! ../../../config */ \"./config/index.js\")\n\nconst options = {\n    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),\n    secretOrKey: config.secret\n}\n\nconst JwtStrategy = new Strategy(options, (payload, done) => {\n    return done(null, payload)\n})\n\nmodule.exports = JwtStrategy\n\n//# sourceURL=webpack://my-notes-backend/./utils/auth/strategies/jwt.strategy.js?");

/***/ }),

/***/ "./utils/auth/strategies/local.strategy.js":
/*!*************************************************!*\
  !*** ./utils/auth/strategies/local.strategy.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { Strategy } = __webpack_require__(/*! passport-local */ \"passport-local\")\nconst UserModel = __webpack_require__(/*! ../../../components/users/model */ \"./components/users/model.js\")\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\")\n\nconst LocalStrategy = new Strategy(async (user, pass, done) => {\n    try {\n        const dbUser = await UserModel.findOne({ username: user })\n        if(!user) {\n            done('no sirvio user', false) \n        }\n\n        const isMatch = await bcrypt.compare(pass, dbUser.password)\n        if (!isMatch) {\n            done('sin autorizar contraseña', false)\n        }\n        done(null, user)\n    } catch (error) {\n        done(error, false)\n    }\n})\n\nmodule.exports = LocalStrategy\n\n//# sourceURL=webpack://my-notes-backend/./utils/auth/strategies/local.strategy.js?");

/***/ }),

/***/ "./utils/billUtils.js":
/*!****************************!*\
  !*** ./utils/billUtils.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const luxon = __webpack_require__(/*! luxon */ \"luxon\")\n\nclass BillUtils {\n    static generateTicket = (billData, concept, value, statusBill = \"pending\") => {\n        // console.log(billData.money)\n        const currentDate = luxon.DateTime.now().toLocaleString()\n        const status = statusBill\n        return {\n            title: status,\n            body: `${currentDate} - ${value} ${billData.money} - ${concept}`,\n            footer: billData._id,\n            color: \"ticket\",\n            append: {\n                date: currentDate,\n                value: value,\n                money: billData.money,\n                concept: concept\n            },\n        }\n    }\n\n    static approveTicket = (ticket, status) => {\n        return {\n            title: status,\n            body: ticket.body,\n            footer: ticket.footer,\n            color: ticket.color,\n            append: ticket.append\n        }\n    }\n}\n\nmodule.exports = BillUtils\n\n//# sourceURL=webpack://my-notes-backend/./utils/billUtils.js?");

/***/ }),

/***/ "@hapi/boom":
/*!*****************************!*\
  !*** external "@hapi/boom" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("@hapi/boom");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "luxon":
/*!************************!*\
  !*** external "luxon" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("luxon");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("passport-local");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;