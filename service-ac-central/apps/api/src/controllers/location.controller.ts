import { Location } from "../models/Location";
import { createCrudController } from "../utils/crudFactory";

export const locationController = createCrudController(Location, {
  defaultSort: "order",
  restrictActiveForPublic: true,
});
