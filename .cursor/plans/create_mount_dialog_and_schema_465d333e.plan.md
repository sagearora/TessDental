# Create a Mount dialog and schema (Hasura for mounts)

## Architecture: Hasura vs imaging-service

- **Hasura (GraphQL)**: All mount-related data. No mount traffic through the imaging-service.
  - **Mount templates**: Query `imaging_mount_template` (already tracked; add new columns in migration).
  - **Mounts**: Query/mutate `imaging_mount` (create, list, get, update, delete).
  - **Mount slots**: Query/mutate `imaging_mount_slot` (assign = insert/update, remove = delete).
  - **Clinic mount settings**: New table `imaging_clinic_mount_settings`; query/mutate via Hasura.
- **Imaging-service (REST)**: Only image assets and upload.
  - Upload: `/imaging/assets/upload-token`, `/imaging/assets/upload-bridge` (and any upload-batch if used).
  - Asset blob/URL: get image by variant (thumb/web/original).
  - Asset metadata: PATCH asset (name, capturedAt, imageSource), DELETE asset.
  - Asset list can stay via Hasura subscription (as on Imaging page) or REST; not part of “mounts.”

**Admin secret**: For running Hasura CLI (e.g. `pnpm hasura:migrate:status`), use your project’s admin secret (e.g. set `HASURA_GRAPHQL_ADMIN_SECRET` in the environment or pass per command). Do not commit the admin secret in repo or .env.

---

## Current state

- **Hasura**: [infra/hasura/metadata/databases/default/tables/](infra/hasura/metadata/databases/default/tables/) already tracks `imaging_mount_template`, `imaging_mount`, `imaging_mount_slot` with `clinic_user` permissions (template read; mount and slot CRUD with clinic/capability checks).
- **Templates**: [infra/hasura/migrations/default/1771059001000_create_imaging_mount_template/up.sql](infra/hasura/migrations/default/1771059001000_create_imaging_mount_template/up.sql) defines `slot_definitions` and `layout_config`. No capture order or transformations yet.
- **Web**: [apps/web/src/api/imaging.ts](apps/web/src/api/imaging.ts) currently calls imaging-service for `listMountTemplates`, `createMount`, `listMounts`, `getMount`, `updateMount`, `assignAssetToMountSlot`, `removeAssetFromMountSlot`, `deleteMount`. These will switch to Apollo/GraphQL.

---

## 1. Schema changes (new migration only)

**Rule**: Run `pnpm hasura:migrate:status` first. Do not modify any migration that is already Applied. Add a new migration version.

### 1.1 Extend `imaging_mount_template`

- **`slot_capture_order`** (jsonb, nullable): Array of `slot_id` strings for the order in which new captures are assigned to slots (e.g. `["slot_1", "slot_2"]`). If null, derive from `slot_definitions` (e.g. by row/col).
- **`default_slot_transformations`** (jsonb, nullable): Object keyed by `slot_id`, e.g. `{ "slot_1": { "rotate": 90, "flip_h": false, "flip_v": false } }`. Allow `rotate` (0|90|180|270), `flip_h`, `flip_v` (booleans).

Add via `ALTER TABLE` in the new migration. Optionally backfill `slot_capture_order` from existing `slot_definitions`.

### 1.2 New table `imaging_clinic_mount_settings`

- **Columns**: `id` bigserial PK, `clinic_id` bigint NOT NULL (FK to clinic), `template_id` bigint NOT NULL (FK to `imaging_mount_template`), `slot_order` jsonb nullable, `slot_transformations` jsonb nullable, `created_at`/`updated_at` (or audit pattern).
- **Unique**: `(clinic_id, template_id)`.
- **Meaning**: `slot_order` overrides template `slot_capture_order` for that clinic; `slot_transformations` overrides/merges with template `default_slot_transformations` per slot.

Add indexes and comments. Apply same audit triggers if used elsewhere.

### 1.3 Hasura metadata

- Track `imaging_clinic_mount_settings`; add permissions so `clinic_user` can read/write only rows where `clinic_id` = `X-Hasura-Clinic-Id` (and optionally require imaging capability).
- After migration, add new columns to `imaging_mount_template` in metadata so they are selectable (if not auto-applied).

### 1.4 Migration: Predefined mount templates (present the available options)

The same new migration (or a dedicated follow-up migration) must **define the set of available mount templates** that the Create a Mount dialog will show. These rows in `imaging_mount_template` are what “present” the options to the user. Match the reference image and your list:

| # | Template (conceptual) | template_key (or existing) | slot_definitions / layout | Notes |
|---|------------------------|----------------------------|---------------------------|--------|
| 1 | Two images, 50% each | `two_horizontal` | 2 slots, row 0 cols 0–1 | Already in 1771059001000. Ensure present. |
| 2 | One fullscreen image | `single` | 1 slot | Already in 1771059001000. |
| 3 | Four images: 2 left (stacked), gap, 2 right (stacked) | **new** e.g. `four_stacked_pairs` | 4 slots: (0,0), (1,0), (0,2), (1,2) in a 2×3 grid; col 1 is gap | INSERT in new migration. |
| 4 | Four images in a row with gap: 2, gap, 2 | **new** e.g. `four_horizontal_gap` | 4 slots in 1 row, cols 0,1,3,4 (col 2 gap) | INSERT. |
| 5 | Four images, 2×2 grid | `four_grid` | 2×2 grid | Already in 1771059001000. |
| 6 | Five images, single row | `five_horizontal` | 5 cols | Already in 1771059001000. |
| 7 | Six images, single row | `six_horizontal` | 6 cols | Already in 1771059001000. |
| 8 | Five images, thin cross | `cross_pattern` | 5 in cross (center + 4 arms) | Already in 1771059001000. |
| 9 | Five images, thick cross (3×3: top center, full middle row, bottom center) | **new** e.g. `thick_cross` | 5 slots in 3×3 grid | INSERT. |
| 10 | Full mouth series, 20 images, central horizontal void (2 rows × 5+gap+5) | **new** e.g. `fms_20_horizontal_void` | 20 slots, two rows, gap in middle of each row | INSERT. |
| 11 | Full mouth series, 18 images, central square void (top 6, middle 2, bottom 6) | `full_mouth_series` or **new** key | 18 slots: 6 top, 2 middle (left/right), 6 bottom | Already have `full_mouth_series` (18 slots); align slot_definitions/layout with central void if needed, or add new template. |

**What the migration does:**

- **INSERT** any template that does not yet exist (by `template_key`). Use the `slot_definitions` and `layout_config` JSONB per the layout format in section 1.5 (grid with `rows`/`cols`; slots with `row`, `col`, optional `row_span`/`col_span`) so the visual preview (orange border, white placeholders) matches the reference image. Gaps are grid cells with no slot.
- **Backfill** `slot_capture_order` for all templates (existing and new): set to the array of `slot_id` in the desired capture order.
- Optionally set `default_slot_transformations` to null for now.

Result: the database presents exactly these mount types in the dialog; the UI loads them via Hasura and renders the preview from `slot_definitions` + `layout_config`.

### 1.5 Layout and dimensions for rendering (JSONB)

Yes — to render mounts and placeholders consistently (preview and full MountView), the schema should store layout/dimensions in a way the UI can interpret. Keeping everything in **JSONB** is the easiest and is already in use; we just standardize the shape.

**Recommended shape (all in existing columns):**

- **`layout_config`** (jsonb): Describes the mount container and grid.
  - `type`: `"grid"` (only type for now).
  - `rows`, `cols`: number of grid rows and columns (defines the grid; gaps are simply cells with no slot).
  - `rowHeights` (optional): array of length `rows`, each value a fraction (0–1) or CSS-like `"1fr"`; if omitted, equal heights.
  - `colWidths` (optional): array of length `cols`, same idea; if omitted, equal widths.
  - `aspectRatio` (optional): string for the overall mount (e.g. `"16:9"`, `"1:1"`).
  Example: `{ "type": "grid", "rows": 2, "cols": 3, "aspectRatio": "3:2" }`.

- **`slot_definitions`** (jsonb): Array of slot objects. Each slot:
  - `slot_id`, `label`, `row`, `col`: required (grid position, 0-based).
  - `row_span`, `col_span` (optional): default 1; allow a placeholder to span multiple grid cells so one image can take 50% of the mount, etc.
  Example: `{ "slot_id": "slot_1", "label": "Left", "row": 0, "col": 0, "row_span": 1, "col_span": 1 }`.

**Rendering:** The UI builds a CSS Grid (or similar) from `layout_config` (rows, cols, rowHeights, colWidths) and places each slot using `grid-row: row+1 / span row_span`, `grid-column: col+1 / span col_span`. No pixel dimensions needed; grid units + optional fractions are enough. Same JSONB works for the small preview in the Create a Mount dialog and for the full MountView.

**Migration:** Existing rows can keep current `layout_config`/`slot_definitions`; add `row_span`/`col_span` only where needed (default 1). New templates (and custom ones) use the full shape.

### 1.6 Custom templates and GUI (add placeholders)

To support a **GUI where users can add placeholders and build custom templates**, we need a place to store clinic-defined templates (system templates stay read-only).

**Option A — New table `imaging_clinic_mount_template` (recommended):**

- Columns: `id`, `clinic_id`, `name`, `description` (optional), `slot_definitions` (jsonb), `layout_config` (jsonb), `slot_capture_order` (jsonb), `default_slot_transformations` (jsonb), `created_at`, `updated_at`, `is_active`. Same JSONB shape as `imaging_mount_template`.
- Permissions: `clinic_user` can insert/select/update/delete only rows where `clinic_id` = `X-Hasura-Clinic-Id` (with imaging capability check if desired).
- When creating a mount, the app loads **system** templates (`imaging_mount_template`) **plus** **clinic** templates (`imaging_clinic_mount_template` for current clinic). Mount row references either a system template (e.g. `template_id` on `imaging_mount` pointing to `imaging_mount_template`) or a clinic template — so we need a way to reference “template”: either (1) add `clinic_template_id` nullable FK on `imaging_mount` and keep `template_id` for system, or (2) use a single “template” source (e.g. a view or polymorphic pattern). Simplest: add nullable `clinic_template_id` to `imaging_mount`; when set, the mount uses that clinic template’s slot_definitions/layout_config; when null, use `template_id` (system).

**Option B — Allow inserts into `imaging_mount_template` with `clinic_id`:**

- Add nullable `clinic_id` to `imaging_mount_template`; null = system, non-null = owned by that clinic. One table, but mixes system and custom and requires care with permissions (clinic can only edit rows where clinic_id = their clinic).

**Recommendation:** Option A. New migration: create `imaging_clinic_mount_template`; add nullable `clinic_template_id` FK on `imaging_mount` to that table. Create a Mount dialog and mount resolution: “template” = system template row OR clinic template row (by template_id vs clinic_template_id).

**Copy system template into clinic (Administrator > Imaging):**

- **System templates** (`imaging_mount_template`) are read-only for clinics; they are the predefined set (see 1.4).
- Under the **administrator area**, add an **Imaging** section (e.g. Admin > Imaging, or Clinic Settings > Imaging) where the clinic can manage mount templates.
- This page lists **system templates** (from `imaging_mount_template`) with a **“Copy to my clinic”** (or “Add to clinic”) action per template.
- **Copy** = INSERT into `imaging_clinic_mount_template` with `clinic_id` = current clinic and copied fields from the system template: `name`, `description`, `slot_definitions`, `layout_config`, `slot_capture_order`, `default_slot_transformations`. The clinic can give the copy a new name if desired (e.g. “Our 2×2 grid”). After copy, the template appears in the clinic’s list and can be used in Create a Mount and optionally edited later in the template builder.
- Result: clinics get their own copies of system templates; they do not edit system templates directly.

**GUI (phase 2 / follow-up):**

- **Template builder** screen: list clinic custom templates (copied + any created from scratch); “New template” opens an editor.
- Editor: set name; set grid size (rows × cols). **Add placeholder**: click “Add slot” and assign `row`, `col`, optional `row_span`, `col_span`, `label`; slots appear as white cells on an orange grid. Remove or resize placeholders. Save writes `slot_definitions` and `layout_config` (and optionally `slot_capture_order`) to `imaging_clinic_mount_template` via Hasura mutation.
- Same JSONB layout format (1.5) makes the builder and the renderer share one contract; no extra “dimensions” table needed.

---

## 2. Frontend: Use Hasura for all mount operations

- **Remove** (or stop using) imaging-service calls for: mount-templates, createMount, listMounts, getMount, updateMount, assignAssetToMountSlot, removeAssetFromMountSlot, deleteMount.
- **Add** GraphQL operations (in [apps/web/src/gql/](apps/web/src/gql/) or inline):
  - **Templates**: Query `imaging_mount_template` (id, template_key, name, description, slot_definitions, layout_config, slot_capture_order, default_slot_transformations, is_active).
  - **Mounts**: Query `imaging_mount` (with relationship to template and mount_slots/asset); mutations insert/update/delete `imaging_mount`.
  - **Slots**: Insert `imaging_mount_slot` (assign); update (change asset_id) or delete (remove from slot).
- **Refactor** [apps/web/src/api/imaging.ts](apps/web/src/api/imaging.ts): Keep only asset-related functions (upload token/bridge, getAssetBlobUrl, updateAsset, deleteAsset, and any asset list if not fully via Hasura). Move mount and template logic to a small module that uses Apollo (e.g. `useQuery`, `useMutation`, or `client.query`/`client.mutate`) with the new GraphQL operations.
- **Imaging page and MountView**: Call the new Hasura-based API/hooks instead of the old imaging-service mount endpoints.

---

## 3. Create a Mount dialog

- **Trigger**: “Create a Mount” button in the gallery card header ([apps/web/src/pages/Imaging.tsx](apps/web/src/pages/Imaging.tsx)) opens a dialog instead of creating a mount with the first template.
- **Dialog**:
  - Title: “Create a Mount”.
  - Load template options: **system** templates (`imaging_mount_template` where `is_active`) **plus** **clinic** templates (`imaging_clinic_mount_template` where `clinic_id` = current clinic and `is_active`). Clinic templates are those the clinic copied from Admin > Imaging or created in the template builder.
  - **Visual preview** per template: use `slot_definitions` and `layout_config` (section 1.5) to render a small grid (e.g. orange border, white placeholder cells by row/col/span) so each option “showcases” the mount type (number of X-rays / placeholders).
  - Show template name and slot count.
  - On **select** (click a card): run Hasura mutation to insert `imaging_mount` with either `template_id` (system) or `clinic_template_id` (clinic template), plus clinic_id, patient_id, name; then close dialog, switch to mounts view, and select the new mount.
- **Data**: All from Hasura; no imaging-service for templates or mount create.

---

## 3b. Administrator > Imaging (mount templates)

- Add an **Imaging** subsection under the administrator area (e.g. [apps/web/src/pages/admin/](apps/web/src/pages/admin/) or under clinic settings) for mount template management.
- **System templates** list: query `imaging_mount_template` (read-only). Show each with name, description, slot count, and visual preview (same grid as in Create a Mount dialog).
- **“Copy to my clinic”** per row: mutation insert into `imaging_clinic_mount_template` copying that system template’s name, description, slot_definitions, layout_config, slot_capture_order, default_slot_transformations; clinic_id = current user’s clinic. Optionally prompt for a custom name for the copy.
- Optionally show **Clinic templates** on the same page (templates already copied or created by the clinic) with edit/delete; edit leads to the template builder (phase 2).

---

## 4. Order and transformations (behavior)

- **Capture order**: When implementing “capture N images and auto-assign to this mount,” use effective slot order: template `slot_capture_order` overridden by clinic `imaging_clinic_mount_settings.slot_order` when present.
- **Transformations**: When rendering a slot in [apps/web/src/components/imaging/MountView.tsx](apps/web/src/components/imaging/MountView.tsx), apply effective transform (template `default_slot_transformations` + clinic override). Pass merged slot transforms into MountView (e.g. from a parent that loads template + clinic settings via Hasura) and apply CSS transform (rotate, flip) to the image in that slot.

---

## 5. Imaging-service scope (after change)

- **Keep**: Health, upload-token, upload-bridge, asset blob URL, PATCH asset, DELETE asset. Optionally asset list if not fully served by Hasura subscription.
- **Remove or deprecate** (no longer called by web): Mount templates list, mount CRUD, mount slot assign/remove. Routes can remain for other clients or be removed in a later cleanup.

---

## Implementation order

1. Run `pnpm hasura:migrate:status`; confirm which imaging migrations are Applied.
2. New migration: (a) ALTER `imaging_mount_template` (slot_capture_order, default_slot_transformations); (b) CREATE `imaging_clinic_mount_settings`; (c) CREATE `imaging_clinic_mount_template` (clinic_id, name, slot_definitions, layout_config, slot_capture_order, default_slot_transformations, ...); (d) ALTER `imaging_mount` add nullable `clinic_template_id` FK to `imaging_clinic_mount_template`; (e) INSERT missing system mount templates from section 1.4; (f) backfill slot_capture_order and use layout shape from 1.5 (row_span/col_span where needed).
3. Hasura: Track new tables; add permissions; ensure template new columns are exposed.
4. Web: Add GraphQL operations and refactor mount/template usage to Apollo; trim imaging.ts to asset-only.
5. Build Create a Mount dialog (visual preview from slot_definitions + layout_config per section 1.5, pick system or clinic template, create via Hasura mutation; resolve template from template_id or clinic_template_id).
6. Add Administrator > Imaging page: list system templates with “Copy to my clinic” (insert into imaging_clinic_mount_template); optionally list clinic templates.
7. Use effective order for auto-assign; use effective transformations in MountView.
8. (Phase 2) Template builder GUI: add/remove placeholders, set grid and row_span/col_span, save to `imaging_clinic_mount_template`; link from Admin > Imaging for editing clinic templates.
