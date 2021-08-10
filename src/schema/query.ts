import { queryType } from 'nexus';

export const Query = queryType({
  definition(t) {
    t.crud.projects({ filtering: true, ordering: true, pagination: true });
    t.crud.project();
    t.crud.projectGroups({ filtering: true, ordering: true, pagination: true });
    t.crud.projectGroup();
  }
});
