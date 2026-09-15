import { TeamMember } from "../models/TeamMember";
import { createCrudController } from "../utils/crudFactory";

export const teamController = createCrudController(TeamMember, {
  defaultSort: "order",
  restrictActiveForPublic: true,
});
