import { Service } from "../models/Service";
import { createCrudController } from "../utils/crudFactory";

export const serviceController = createCrudController(Service, {
  filterableFields: ["category"],
  defaultSort: "order",
  restrictActiveForPublic: true,
});
