# Usage

After enabling the module you need to edit a content type that have at least one multivalued paragraph field. (`/admin/structure/types/manage/YOUR-CT`).

There you'll find a new third party setting "Paragraph field layout builder". Just select the fields you want to attach the layout builder and that's all. Now you can go to any node view of this type and start editing the layout of this field.

TODOS:

- Extend this to all entity types not just to nodes.

LIMITATIONS:

- Only works for "full" view mode.
