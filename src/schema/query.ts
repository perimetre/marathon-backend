import { queryType } from 'nexus';

export const Query = queryType({
  definition(t) {
    t.crud.collections({ filtering: true, ordering: true, pagination: true });
    t.crud.collection();

    t.crud.collectionFinishes({ filtering: true, ordering: true, pagination: true });

    t.crud.finishes({ filtering: true, ordering: true, pagination: true });
    t.crud.finish();

    t.crud.modules({ filtering: true, ordering: true, pagination: true });
    t.crud.module();

    t.crud.projects({ filtering: true, ordering: true, pagination: true });
    t.crud.project();

    t.crud.projectGroups({ filtering: true, ordering: true, pagination: true });
    t.crud.projectGroup();

    t.crud.projectModules({ filtering: true, ordering: true, pagination: true });
    t.crud.projectModule();

    t.crud.slides({ filtering: true, ordering: true, pagination: true });
    t.crud.slide();

    t.crud.slideDepths({ filtering: true, ordering: true, pagination: true });
    t.crud.slideDepth();

    t.crud.types({ filtering: true, ordering: true, pagination: true });
    t.crud.type();

    t.crud.slideSuppliers({ filtering: true, ordering: true, pagination: true });
    t.crud.slideSupplier();
  }
});
