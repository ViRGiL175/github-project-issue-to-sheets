import * as Core from "@actions/core";
import {Importer} from "./Importer";

new Importer().start().then(r => {
    Core.info(JSON.stringify(r, null, Importer.LOG_SPACING_SIZE))
})
