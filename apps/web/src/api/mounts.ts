/**
 * Mount and template API via Hasura GraphQL.
 * All mount/template operations go through Apollo; imaging-service is used only for assets.
 */

import { gql } from '@apollo/client'
import { apolloClient } from '@/apollo/client'

// --- Types (aligned with Hasura schema and plan 1.5) ---

export interface MountSlotDefinition {
  slot_id: string
  label: string
  row: number
  col: number
  row_span?: number
  col_span?: number
}

export interface LayoutConfig {
  type?: string
  rows?: number
  cols?: number
  rowHeights?: (number | string)[]
  colWidths?: (number | string)[]
  aspectRatio?: string
}

export interface MountTemplateShape {
  id: number
  name: string
  description?: string | null
  slot_definitions: MountSlotDefinition[] | unknown
  layout_config?: LayoutConfig | null
  slot_capture_order?: string[] | null
  default_slot_transformations?: Record<string, { rotate?: number; flip_h?: boolean; flip_v?: boolean }> | null
}

export interface ImagingMountSlot {
  id: number
  mount_id: number
  slot_id: string
  asset_id: number | null
  asset?: {
    id: number
    name?: string | null
    captured_at?: string
    image_source?: string | null
    modality?: string
    thumb_key?: string | null
    web_key?: string | null
  } | null
}

export interface ImagingMount {
  id: number
  clinic_id: number
  patient_id: number
  template_id?: number | null
  clinic_template_id?: number | null
  name: string | null
  description: string | null
  created_at: string
  created_by?: string | null
  updated_at?: string
  updated_by?: string | null
  is_active: boolean
  template?: MountTemplateShape | null
  clinic_template?: MountTemplateShape | null
  mount_slots?: ImagingMountSlot[]
  slots?: ImagingMountSlot[]
}

/** System template (imaging_mount_template) - has template_key */
export interface SystemMountTemplate extends MountTemplateShape {
  template_key: string
  is_active?: boolean
}

/** Clinic template (imaging_clinic_mount_template) */
export interface ClinicMountTemplate extends MountTemplateShape {
  clinic_id: number
  is_active?: boolean
}

/** Resolve effective template from a mount (system or clinic) */
export function getMountTemplate(mount: ImagingMount): MountTemplateShape | null {
  if (mount.template) return mount.template
  if (mount.clinic_template) return mount.clinic_template
  return null
}

/**
 * Effective slot order for auto-assigning captures: clinic slot_order overrides template slot_capture_order,
 * otherwise derive from slot_definitions (row, then col).
 */
export function getEffectiveSlotOrder(
  template: MountTemplateShape,
  clinicSlotOrder?: string[] | null
): string[] {
  if (clinicSlotOrder && Array.isArray(clinicSlotOrder) && clinicSlotOrder.length > 0) {
    return clinicSlotOrder
  }
  const order = template.slot_capture_order
  if (order && Array.isArray(order) && order.length > 0) {
    return order as string[]
  }
  const defs = Array.isArray(template.slot_definitions)
    ? (template.slot_definitions as MountSlotDefinition[])
    : []
  defs.sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col))
  return defs.map((d) => d.slot_id)
}

/** Normalize mount so .template is the effective template and .slots is the slot list */
export function normalizeMount(m: ImagingMount): ImagingMount {
  const template = getMountTemplate(m)
  const slots = m.mount_slots ?? m.slots ?? []
  return {
    ...m,
    template: template ?? undefined,
    slots,
  }
}

/**
 * First empty slot id in capture order for a mount, or null if all slots are filled.
 * Uses getEffectiveSlotOrder (template slot_capture_order or row/col fallback).
 */
export function getNextEmptySlotId(mount: ImagingMount, clinicSlotOrder?: string[] | null): string | null {
  const template = getMountTemplate(mount)
  if (!template) return null
  const order = getEffectiveSlotOrder(template, clinicSlotOrder)
  const filled = new Set((mount.mount_slots ?? mount.slots ?? []).map((s) => s.slot_id))
  for (const slotId of order) {
    if (!filled.has(slotId)) return slotId
  }
  return null
}

// --- GraphQL documents (inline so codegen is not required) ---

const GET_SYSTEM_MOUNT_TEMPLATES = gql`
  query GetSystemMountTemplates {
    imaging_mount_template(
      where: { is_active: { _eq: true } }
      order_by: { template_key: asc }
    ) {
      id
      template_key
      name
      description
      slot_definitions
      layout_config
      slot_capture_order
      default_slot_transformations
      is_active
    }
  }
`

const GET_CLINIC_MOUNT_TEMPLATES = gql`
  query GetClinicMountTemplates($clinicId: bigint!) {
    imaging_clinic_mount_template(
      where: { clinic_id: { _eq: $clinicId }, is_active: { _eq: true } }
      order_by: { name: asc }
    ) {
      id
      clinic_id
      name
      description
      slot_definitions
      layout_config
      slot_capture_order
      default_slot_transformations
      is_active
    }
  }
`

const GET_MOUNTS_BY_PATIENT = gql`
  query GetMountsByPatient($patientId: bigint!, $clinicId: bigint!) {
    imaging_mount(
      where: {
        patient_id: { _eq: $patientId }
        clinic_id: { _eq: $clinicId }
        is_active: { _eq: true }
      }
      order_by: { created_at: desc }
    ) {
      id
      clinic_id
      patient_id
      template_id
      clinic_template_id
      name
      description
      created_at
      is_active
      template {
        id
        template_key
        name
        slot_definitions
        layout_config
        slot_capture_order
        default_slot_transformations
      }
      clinic_template {
        id
        name
        slot_definitions
        layout_config
        slot_capture_order
        default_slot_transformations
      }
      mount_slots {
        id
        mount_id
        slot_id
        asset_id
        asset {
          id
          name
          captured_at
          image_source
        }
      }
    }
  }
`

const GET_MOUNT_BY_ID = gql`
  query GetMountById($id: bigint!) {
    imaging_mount_by_pk(id: $id) {
      id
      clinic_id
      patient_id
      template_id
      clinic_template_id
      name
      description
      created_at
      created_by
      updated_at
      updated_by
      is_active
      template {
        id
        template_key
        name
        description
        slot_definitions
        layout_config
        slot_capture_order
        default_slot_transformations
      }
      clinic_template {
        id
        name
        description
        slot_definitions
        layout_config
        slot_capture_order
        default_slot_transformations
      }
      mount_slots {
        id
        mount_id
        slot_id
        asset_id
        asset {
          id
          name
          captured_at
          image_source
        }
      }
    }
  }
`

const INSERT_IMAGING_MOUNT = gql`
  mutation InsertImagingMount($object: imaging_mount_insert_input!) {
    insert_imaging_mount_one(object: $object) {
      id
      clinic_id
      patient_id
      template_id
      clinic_template_id
      name
      description
      created_at
      is_active
      template {
        id
        template_key
        name
        slot_definitions
        layout_config
        slot_capture_order
        default_slot_transformations
      }
      clinic_template {
        id
        name
        slot_definitions
        layout_config
        slot_capture_order
        default_slot_transformations
      }
      mount_slots {
        id
        mount_id
        slot_id
        asset_id
      }
    }
  }
`

const UPDATE_IMAGING_MOUNT = gql`
  mutation UpdateImagingMount($id: bigint!, $updates: imaging_mount_set_input!) {
    update_imaging_mount_by_pk(pk_columns: { id: $id }, _set: $updates) {
      id
      name
      description
      updated_at
    }
  }
`

const DELETE_IMAGING_MOUNT = gql`
  mutation DeleteImagingMount($id: bigint!) {
    delete_imaging_mount_by_pk(id: $id) {
      id
    }
  }
`

const INSERT_IMAGING_MOUNT_SLOT = gql`
  mutation InsertImagingMountSlot($object: imaging_mount_slot_insert_input!) {
    insert_imaging_mount_slot_one(object: $object) {
      id
      mount_id
      slot_id
      asset_id
    }
  }
`

const UPDATE_IMAGING_MOUNT_SLOT_ASSET = gql`
  mutation UpdateImagingMountSlotAsset($id: bigint!, $assetId: bigint) {
    update_imaging_mount_slot_by_pk(
      pk_columns: { id: $id }
      _set: { asset_id: $assetId }
    ) {
      id
      mount_id
      slot_id
      asset_id
    }
  }
`

const DELETE_IMAGING_MOUNT_SLOT_BY_MOUNT_AND_SLOT = gql`
  mutation DeleteImagingMountSlotByMountAndSlot($mountId: bigint!, $slotId: String!) {
    delete_imaging_mount_slot(
      where: {
        mount_id: { _eq: $mountId }
        slot_id: { _eq: $slotId }
      }
    ) {
      affected_rows
    }
  }
`

const INSERT_CLINIC_MOUNT_TEMPLATE = gql`
  mutation InsertClinicMountTemplate($object: imaging_clinic_mount_template_insert_input!) {
    insert_imaging_clinic_mount_template_one(object: $object) {
      id
      clinic_id
      name
      description
      slot_definitions
      layout_config
      slot_capture_order
      default_slot_transformations
      is_active
    }
  }
`

const UPDATE_CLINIC_MOUNT_TEMPLATE = gql`
  mutation UpdateClinicMountTemplate(
    $id: bigint!
    $updates: imaging_clinic_mount_template_set_input!
  ) {
    update_imaging_clinic_mount_template_by_pk(
      pk_columns: { id: $id }
      _set: $updates
    ) {
      id
      name
      description
      slot_definitions
      layout_config
      slot_capture_order
      default_slot_transformations
      is_active
    }
  }
`

// --- API ---

export async function listSystemMountTemplates(): Promise<SystemMountTemplate[]> {
  const result = await apolloClient.query<{ imaging_mount_template: SystemMountTemplate[] }>({
    query: GET_SYSTEM_MOUNT_TEMPLATES,
  })
  return result.data?.imaging_mount_template ?? []
}

export async function listClinicMountTemplates(clinicId: number): Promise<ClinicMountTemplate[]> {
  const result = await apolloClient.query<{
    imaging_clinic_mount_template: ClinicMountTemplate[]
  }>({
    query: GET_CLINIC_MOUNT_TEMPLATES,
    variables: { clinicId },
  })
  return result.data?.imaging_clinic_mount_template ?? []
}

/** Combined list for Create a Mount dialog: system + clinic templates */
export async function listMountTemplates(clinicId: number): Promise<{
  system: SystemMountTemplate[]
  clinic: ClinicMountTemplate[]
}> {
  const [system, clinic] = await Promise.all([
    listSystemMountTemplates(),
    listClinicMountTemplates(clinicId),
  ])
  return { system, clinic }
}

export async function listMounts(patientId: number, clinicId: number): Promise<ImagingMount[]> {
  const result = await apolloClient.query<{ imaging_mount: ImagingMount[] }>({
    query: GET_MOUNTS_BY_PATIENT,
    variables: { patientId, clinicId },
  })
  const rows = result.data?.imaging_mount ?? []
  return rows.map(normalizeMount)
}

export async function getMount(mountId: number): Promise<ImagingMount> {
  const result = await apolloClient.query<{ imaging_mount_by_pk: ImagingMount | null }>({
    query: GET_MOUNT_BY_ID,
    variables: { id: mountId },
  })
  const mount = result.data?.imaging_mount_by_pk
  if (!mount) throw new Error('Mount not found')
  return normalizeMount(mount)
}

export interface CreateMountRequest {
  patientId: number
  clinicId: number
  templateId?: number | null
  clinicTemplateId?: number | null
  name?: string | null
  description?: string | null
}

export async function createMount(data: CreateMountRequest): Promise<ImagingMount> {
  const object: Record<string, unknown> = {
    patient_id: data.patientId,
    clinic_id: data.clinicId,
    name: data.name ?? null,
    description: data.description ?? null,
    is_active: true,
  }
  if (data.templateId != null) {
    object.template_id = data.templateId
  }
  if (data.clinicTemplateId != null) {
    object.clinic_template_id = data.clinicTemplateId
  }
  const result = await apolloClient.mutate<{ insert_imaging_mount_one: ImagingMount }>({
    mutation: INSERT_IMAGING_MOUNT,
    variables: { object },
  })
  const mount = result.data?.insert_imaging_mount_one
  if (!mount) throw new Error('Failed to create mount')
  return normalizeMount(mount)
}

export interface UpdateMountRequest {
  name?: string | null
  description?: string | null
}

export async function updateMount(
  mountId: number,
  data: UpdateMountRequest
): Promise<void> {
  await apolloClient.mutate({
    mutation: UPDATE_IMAGING_MOUNT,
    variables: { id: mountId, updates: data },
  })
}

export async function deleteMount(mountId: number): Promise<void> {
  await apolloClient.mutate({
    mutation: DELETE_IMAGING_MOUNT,
    variables: { id: mountId },
  })
}

/** Assign an asset to a slot. Inserts or updates the slot row. */
export async function assignAssetToMountSlot(
  mountId: number,
  slotId: string,
  assetId: number
): Promise<ImagingMountSlot> {
  const mount = await getMount(mountId)
  const existing = (mount.mount_slots ?? mount.slots ?? []).find((s) => s.slot_id === slotId)
  if (existing) {
    await apolloClient.mutate({
      mutation: UPDATE_IMAGING_MOUNT_SLOT_ASSET,
      variables: { id: existing.id, assetId },
    })
    return { ...existing, asset_id: assetId }
  }
  const result = await apolloClient.mutate<{ insert_imaging_mount_slot_one: ImagingMountSlot }>({
    mutation: INSERT_IMAGING_MOUNT_SLOT,
    variables: {
      object: { mount_id: mountId, slot_id: slotId, asset_id: assetId },
    },
  })
  const slot = result.data?.insert_imaging_mount_slot_one
  if (!slot) throw new Error('Failed to assign asset to slot')
  return slot
}

export async function removeAssetFromMountSlot(mountId: number, slotId: string): Promise<void> {
  await apolloClient.mutate({
    mutation: DELETE_IMAGING_MOUNT_SLOT_BY_MOUNT_AND_SLOT,
    variables: { mountId, slotId },
  })
}

/** Copy a system template into the clinic (Admin > Imaging). */
export async function copySystemTemplateToClinic(
  clinicId: number,
  systemTemplate: SystemMountTemplate,
  customName?: string | null
): Promise<ClinicMountTemplate> {
  const slotDefs = Array.isArray(systemTemplate.slot_definitions)
    ? systemTemplate.slot_definitions
    : (systemTemplate.slot_definitions as unknown)
  const result = await apolloClient.mutate<{
    insert_imaging_clinic_mount_template_one: ClinicMountTemplate
  }>({
    mutation: INSERT_CLINIC_MOUNT_TEMPLATE,
    variables: {
      object: {
        clinic_id: clinicId,
        name: customName ?? systemTemplate.name,
        description: systemTemplate.description ?? null,
        slot_definitions: slotDefs,
        layout_config: systemTemplate.layout_config ?? null,
        slot_capture_order: systemTemplate.slot_capture_order ?? null,
        default_slot_transformations: systemTemplate.default_slot_transformations ?? null,
        is_active: true,
      },
    },
  })
  const row = result.data?.insert_imaging_clinic_mount_template_one
  if (!row) throw new Error('Failed to copy template to clinic')
  return row
}

export interface UpdateClinicMountTemplateRequest {
  name?: string | null
  description?: string | null
  slot_definitions?: MountSlotDefinition[] | null
  layout_config?: LayoutConfig | null
  slot_capture_order?: string[] | null
  default_slot_transformations?: Record<string, { rotate?: number; flip_h?: boolean; flip_v?: boolean }> | null
  is_active?: boolean
}

export interface CreateClinicMountTemplateRequest {
  clinicId: number
  name: string
  description?: string | null
  slot_definitions?: MountSlotDefinition[]
  layout_config?: LayoutConfig | null
}

/** Create a new clinic template (for template builder "New template"). */
export async function createClinicMountTemplate(
  data: CreateClinicMountTemplateRequest
): Promise<ClinicMountTemplate> {
  const slotDefs = data.slot_definitions ?? [
    { slot_id: 'slot_1', label: 'Slot 1', row: 0, col: 0, row_span: 1, col_span: 1 },
  ]
  const layoutConfig = data.layout_config ?? { type: 'grid', rows: 1, cols: 1 }
  const result = await apolloClient.mutate<{
    insert_imaging_clinic_mount_template_one: ClinicMountTemplate
  }>({
    mutation: INSERT_CLINIC_MOUNT_TEMPLATE,
    variables: {
      object: {
        clinic_id: data.clinicId,
        name: data.name,
        description: data.description ?? null,
        slot_definitions: slotDefs,
        layout_config: layoutConfig,
        slot_capture_order: slotDefs.map((s) => s.slot_id),
        is_active: true,
      },
    },
  })
  const row = result.data?.insert_imaging_clinic_mount_template_one
  if (!row) throw new Error('Failed to create clinic template')
  return row
}

export async function updateClinicMountTemplate(
  id: number,
  data: UpdateClinicMountTemplateRequest
): Promise<ClinicMountTemplate> {
  const result = await apolloClient.mutate<{
    update_imaging_clinic_mount_template_by_pk: ClinicMountTemplate
  }>({
    mutation: UPDATE_CLINIC_MOUNT_TEMPLATE,
    variables: { id, updates: data },
  })
  const row = result.data?.update_imaging_clinic_mount_template_by_pk
  if (!row) throw new Error('Failed to update clinic template')
  return row
}
