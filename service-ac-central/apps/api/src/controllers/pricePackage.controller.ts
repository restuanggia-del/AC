import { PricePackage } from "../models/PricePackage";
import { createCrudController } from "../utils/crudFactory";

export const pricePackageController = createCrudController(PricePackage, {
  defaultSort: "order",
  restrictActiveForPublic: true,
});
