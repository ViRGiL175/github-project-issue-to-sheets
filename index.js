"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core = require("@actions/core");
const Importer_1 = require("./Importer");
new Importer_1.Importer().start().then(r => {
    Core.info(JSON.stringify(r, null, Importer_1.Importer.LOG_SPACING_SIZE));
});
//# sourceMappingURL=index.js.map