import { Portfolio } from "../models/Portfolio";
import { createCrudController } from "../utils/crudFactory";

export const portfolioController = createCrudController(Portfolio, {
  filterableFields: ["category"],
  defaultSort: "-createdAt",
  restrictActiveForPublic: true,
});
