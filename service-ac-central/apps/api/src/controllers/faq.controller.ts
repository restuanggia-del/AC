import { FAQ } from "../models/FAQ";
import { createCrudController } from "../utils/crudFactory";

export const faqController = createCrudController(FAQ, {
  defaultSort: "order",
  restrictActiveForPublic: true,
});
