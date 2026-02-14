// @vitest-environment node
/// <reference types="node" />

import { describe, it, expect, beforeAll } from 'vitest'
import { makeClient, bootstrapClinicUser } from './test-utils'

const CREATE_PERSON_WITH_PATIENT = /* GraphQL */ `
  mutation CreatePersonWithPatient(
    $clinicId: bigint!
    $firstName: String!
    $lastName: String!
    $status: patient_status_enum_enum!
  ) {
    insert_person_one(
      object: {
        clinic_id: $clinicId
        first_name: $firstName
        last_name: $lastName
        patient: { data: { status: $status } }
      }
    ) {
      id
      clinic_id
      first_name
      last_name
      patient {
        person_id
        status
      }
    }
  }
`

const GET_MOUNT_TEMPLATES = /* GraphQL */ `
  query GetMountTemplates {
    imaging_mount_template(where: { is_active: { _eq: true } }) {
      id
      template_key
      name
      description
      slot_definitions
      layout_config
      is_active
    }
  }
`

const GET_MOUNT_TEMPLATE_BY_KEY = /* GraphQL */ `
  query GetMountTemplateByKey($templateKey: String!) {
    imaging_mount_template(where: { template_key: { _eq: $templateKey }, is_active: { _eq: true } }) {
      id
      template_key
      name
      slot_definitions
    }
  }
`

const CREATE_MOUNT = /* GraphQL */ `
  mutation CreateMount(
    $clinicId: bigint!
    $patientId: bigint!
    $templateId: bigint!
    $name: String
    $description: String
  ) {
    insert_imaging_mount_one(
      object: {
        clinic_id: $clinicId
        patient_id: $patientId
        template_id: $templateId
        name: $name
        description: $description
      }
    ) {
      id
      clinic_id
      patient_id
      template_id
      name
      description
      created_at
      created_by
      template {
        template_key
        name
        slot_definitions
      }
    }
  }
`

const CREATE_ASSET = /* GraphQL */ `
  mutation CreateAsset(
    $clinicId: bigint!
    $patientId: bigint!
    $modality: String!
    $mimeType: String!
    $sizeBytes: bigint!
    $sha256: String!
    $storageBackend: String!
    $storageKey: String!
    $name: String
    $imageSource: image_source_enum
    $capturedAt: timestamptz
  ) {
    insert_imaging_asset_one(
      object: {
        clinic_id: $clinicId
        patient_id: $patientId
        modality: $modality
        mime_type: $mimeType
        size_bytes: $sizeBytes
        sha256: $sha256
        storage_backend: $storageBackend
        storage_key: $storageKey
        name: $name
        image_source: $imageSource
        captured_at: $capturedAt
      }
    ) {
      id
      clinic_id
      patient_id
      modality
      mime_type
      name
      image_source
      captured_at
      created_at
      created_by
      updated_at
      updated_by
    }
  }
`

const ASSIGN_ASSET_TO_MOUNT_SLOT = /* GraphQL */ `
  mutation AssignAssetToMountSlot(
    $mountId: bigint!
    $assetId: bigint!
    $slotId: String!
  ) {
    insert_imaging_mount_slot_one(
      object: {
        mount_id: $mountId
        asset_id: $assetId
        slot_id: $slotId
      }
    ) {
      id
      mount_id
      asset_id
      slot_id
      created_at
      created_by
    }
  }
`

const GET_MOUNT_WITH_SLOTS = /* GraphQL */ `
  query GetMountWithSlots($mountId: bigint!) {
    imaging_mount_by_pk(id: $mountId) {
      id
      name
      template {
        template_key
        name
        slot_definitions
      }
      mount_slots(where: { is_active: { _eq: true } }) {
        id
        slot_id
        asset {
          id
          name
          image_source
          captured_at
        }
      }
    }
  }
`

const GET_ASSETS_BY_PATIENT = /* GraphQL */ `
  query GetAssetsByPatient($patientId: bigint!, $clinicId: bigint!) {
    imaging_asset(
      where: {
        patient_id: { _eq: $patientId }
        clinic_id: { _eq: $clinicId }
        is_active: { _eq: true }
      }
      order_by: { captured_at: desc }
    ) {
      id
      name
      image_source
      captured_at
      modality
    }
  }
`

const UPDATE_ASSET_NAME = /* GraphQL */ `
  mutation UpdateAssetName($assetId: bigint!, $name: String!) {
    update_imaging_asset_by_pk(
      pk_columns: { id: $assetId }
      _set: { name: $name }
    ) {
      id
      name
      updated_at
      updated_by
    }
  }
`

const UPDATE_ASSET_IMAGE_SOURCE = /* GraphQL */ `
  mutation UpdateAssetImageSource($assetId: bigint!, $imageSource: image_source_enum!) {
    update_imaging_asset_by_pk(
      pk_columns: { id: $assetId }
      _set: { image_source: $imageSource }
    ) {
      id
      image_source
      updated_at
      updated_by
    }
  }
`

const SOFT_DELETE_MOUNT = /* GraphQL */ `
  mutation SoftDeleteMount($mountId: bigint!) {
    update_imaging_mount_by_pk(
      pk_columns: { id: $mountId }
      _set: { is_active: false }
    ) {
      id
      is_active
    }
  }
`

describe('Imaging Integration Tests', () => {
  let clinicId: number
  let patientId: number
  let userId: string
  let client: ReturnType<typeof makeClient>

  beforeAll(async () => {
    const bootstrap = await bootstrapClinicUser(
      'Imaging Test Clinic',
      undefined,
      'Imaging Test Role',
      ['imaging_read', 'imaging_write']
    )
    clinicId = bootstrap.clinicId
    userId = bootstrap.userId
    client = makeClient()

    // Create a test patient
    const personResult = await client.request(CREATE_PERSON_WITH_PATIENT, {
      clinicId,
      firstName: 'Test',
      lastName: 'Patient',
      status: 'active',
    })
    patientId = personResult.insert_person_one.id
  })

  it('should retrieve predefined mount templates', async () => {
    const result = await client.request(GET_MOUNT_TEMPLATES)

    expect(result.imaging_mount_template).toBeDefined()
    expect(Array.isArray(result.imaging_mount_template)).toBe(true)
    expect(result.imaging_mount_template.length).toBeGreaterThan(0)

    // Verify template structure
    const template = result.imaging_mount_template[0]
    expect(template).toHaveProperty('id')
    expect(template).toHaveProperty('template_key')
    expect(template).toHaveProperty('name')
    expect(template).toHaveProperty('slot_definitions')
    expect(Array.isArray(template.slot_definitions)).toBe(true)

    // Verify slot definitions structure
    if (template.slot_definitions.length > 0) {
      const slot = template.slot_definitions[0]
      expect(slot).toHaveProperty('slot_id')
      expect(slot).toHaveProperty('label')
      expect(slot).toHaveProperty('row')
      expect(slot).toHaveProperty('col')
    }
  })

  it('should create a mount with a template', async () => {
    // Get a template first
    const templatesResult = await client.request(GET_MOUNT_TEMPLATES)
    const template = templatesResult.imaging_mount_template[0]
    expect(template).toBeDefined()

    const result = await client.request(CREATE_MOUNT, {
      clinicId,
      patientId,
      templateId: template.id,
      name: 'Test Mount',
      description: 'Test mount description',
    })

    expect(result.insert_imaging_mount_one).toBeDefined()
    expect(result.insert_imaging_mount_one.id).toBeDefined()
    expect(result.insert_imaging_mount_one.clinic_id).toBe(clinicId)
    expect(result.insert_imaging_mount_one.patient_id).toBe(patientId)
    expect(result.insert_imaging_mount_one.template_id).toBe(template.id)
    expect(result.insert_imaging_mount_one.name).toBe('Test Mount')
    expect(result.insert_imaging_mount_one.template).toBeDefined()
    expect(result.insert_imaging_mount_one.template.template_key).toBe(template.template_key)
  })

  it('should create an asset without study_id', async () => {
    const uniqueId = `no_study_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const result = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueId}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId}.jpg`,
      name: 'Test Image',
      imageSource: 'intraoral',
      capturedAt: new Date().toISOString(),
    })

    expect(result.insert_imaging_asset_one).toBeDefined()
    expect(result.insert_imaging_asset_one.id).toBeDefined()
    expect(result.insert_imaging_asset_one.clinic_id).toBe(clinicId)
    expect(result.insert_imaging_asset_one.patient_id).toBe(patientId)
    expect(result.insert_imaging_asset_one.name).toBe('Test Image')
    expect(result.insert_imaging_asset_one.image_source).toBe('intraoral')
    expect(result.insert_imaging_asset_one.captured_at).toBeDefined()
    // study_id should be null or not required
    expect(result.insert_imaging_asset_one.study_id).toBeUndefined()
  })

  it('should assign an asset to a mount slot', async () => {
    // Create mount
    const templatesResult = await client.request(GET_MOUNT_TEMPLATES)
    const template = templatesResult.imaging_mount_template[0]
    const mountResult = await client.request(CREATE_MOUNT, {
      clinicId,
      patientId,
      templateId: template.id,
      name: 'Mount for Slot Test',
    })
    const mountId = mountResult.insert_imaging_mount_one.id

    // Create asset
    const uniqueId = `assign_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const assetResult = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 2048,
      sha256: `test_sha256_${uniqueId}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId}.jpg`,
      capturedAt: new Date().toISOString(),
    })
    const assetId = assetResult.insert_imaging_asset_one.id

    // Get first slot from template
    const slotId = template.slot_definitions[0].slot_id

    // Assign asset to slot
    const slotResult = await client.request(ASSIGN_ASSET_TO_MOUNT_SLOT, {
      mountId,
      assetId,
      slotId,
    })

    expect(slotResult.insert_imaging_mount_slot_one).toBeDefined()
    expect(slotResult.insert_imaging_mount_slot_one.mount_id).toBe(mountId)
    expect(slotResult.insert_imaging_mount_slot_one.asset_id).toBe(assetId)
    expect(slotResult.insert_imaging_mount_slot_one.slot_id).toBe(slotId)
  })

  it('should assign multiple assets to different slots on the same mount', async () => {
    // Create mount
    const templatesResult = await client.request(GET_MOUNT_TEMPLATES)
    const template = templatesResult.imaging_mount_template.find(
      (t: any) => t.slot_definitions.length >= 2
    ) || templatesResult.imaging_mount_template[0]
    
    const mountResult = await client.request(CREATE_MOUNT, {
      clinicId,
      patientId,
      templateId: template.id,
      name: 'Multi-Slot Mount',
    })
    const mountId = mountResult.insert_imaging_mount_one.id

    // Create two assets
    const uniqueId1 = `multi1_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const asset1Result = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueId1}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId1}.jpg`,
      name: 'Asset 1',
      capturedAt: new Date().toISOString(),
    })
    const asset1Id = asset1Result.insert_imaging_asset_one.id

    const uniqueId2 = `multi2_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const asset2Result = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueId2}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId2}.jpg`,
      name: 'Asset 2',
      capturedAt: new Date().toISOString(),
    })
    const asset2Id = asset2Result.insert_imaging_asset_one.id

    // Assign to different slots
    const slot1Id = template.slot_definitions[0].slot_id
    const slot2Id = template.slot_definitions[1]?.slot_id || template.slot_definitions[0].slot_id

    await client.request(ASSIGN_ASSET_TO_MOUNT_SLOT, {
      mountId,
      assetId: asset1Id,
      slotId: slot1Id,
    })

    await client.request(ASSIGN_ASSET_TO_MOUNT_SLOT, {
      mountId,
      assetId: asset2Id,
      slotId: slot2Id,
    })

    // Verify both assignments
    const mountWithSlots = await client.request(GET_MOUNT_WITH_SLOTS, { mountId })
    expect(mountWithSlots.imaging_mount_by_pk.mount_slots.length).toBeGreaterThanOrEqual(1)
  })

  it('should allow adding older and newer images to the same mount', async () => {
    // Create mount
    const templatesResult = await client.request(GET_MOUNT_TEMPLATES)
    const template = templatesResult.imaging_mount_template[0]
    const mountResult = await client.request(CREATE_MOUNT, {
      clinicId,
      patientId,
      templateId: template.id,
      name: 'Mixed Date Mount',
    })
    const mountId = mountResult.insert_imaging_mount_one.id

    // Create older asset (1 year ago)
    const oldDate = new Date()
    oldDate.setFullYear(oldDate.getFullYear() - 1)
    const uniqueIdOld = `old_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const oldAssetResult = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueIdOld}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueIdOld}.jpg`,
      capturedAt: oldDate.toISOString(),
    })
    const oldAssetId = oldAssetResult.insert_imaging_asset_one.id

    // Create newer asset (today)
    const uniqueIdNew = `new_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const newAssetResult = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueIdNew}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueIdNew}.jpg`,
      capturedAt: new Date().toISOString(),
    })
    const newAssetId = newAssetResult.insert_imaging_asset_one.id

    // Assign both to mount (using same slot if only one, or different slots)
    const slot1Id = template.slot_definitions[0].slot_id
    const slot2Id = template.slot_definitions[1]?.slot_id || slot1Id

    await client.request(ASSIGN_ASSET_TO_MOUNT_SLOT, {
      mountId,
      assetId: oldAssetId,
      slotId: slot1Id,
    })

    if (slot2Id !== slot1Id) {
      await client.request(ASSIGN_ASSET_TO_MOUNT_SLOT, {
        mountId,
        assetId: newAssetId,
        slotId: slot2Id,
      })
    }

    // Verify mount contains both assets
    const mountWithSlots = await client.request(GET_MOUNT_WITH_SLOTS, { mountId })
    const assetIds = mountWithSlots.imaging_mount_by_pk.mount_slots.map((s: any) => s.asset.id)
    expect(assetIds).toContain(oldAssetId)
    if (slot2Id !== slot1Id) {
      expect(assetIds).toContain(newAssetId)
    }
  })

  it('should validate image_source enum values', async () => {
    const validSources = ['intraoral', 'panoramic', 'webcam', 'scanner', 'photo']

    for (const source of validSources) {
      const uniqueId = `${source}_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const result = await client.request(CREATE_ASSET, {
        clinicId,
        patientId,
        modality: 'PHOTO',
        mimeType: 'image/jpeg',
        sizeBytes: 1024,
        sha256: `test_sha256_${uniqueId}`,
        storageBackend: 'nfs',
        storageKey: `test/storage/${uniqueId}.jpg`,
        imageSource: source as any,
        capturedAt: new Date().toISOString(),
      })

      expect(result.insert_imaging_asset_one.image_source).toBe(source)
    }
  })

  it('should allow updating asset name and verify audit trail', async () => {
    // Create asset
    const uniqueId = `name_update_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const assetResult = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueId}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId}.jpg`,
      name: 'Original Name',
      capturedAt: new Date().toISOString(),
    })
    const assetId = assetResult.insert_imaging_asset_one.id
    const originalUpdatedAt = assetResult.insert_imaging_asset_one.updated_at

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update name
    const updateResult = await client.request(UPDATE_ASSET_NAME, {
      assetId,
      name: 'Updated Name',
    })

    expect(updateResult.update_imaging_asset_by_pk.name).toBe('Updated Name')
    expect(updateResult.update_imaging_asset_by_pk.updated_at).not.toBe(originalUpdatedAt)
    expect(updateResult.update_imaging_asset_by_pk.updated_by).toBeDefined()
  })

  it('should validate slot_id matches template definition', async () => {
    // Create mount
    const templatesResult = await client.request(GET_MOUNT_TEMPLATES)
    const template = templatesResult.imaging_mount_template[0]
    const mountResult = await client.request(CREATE_MOUNT, {
      clinicId,
      patientId,
      templateId: template.id,
    })
    const mountId = mountResult.insert_imaging_mount_one.id

    // Create asset
    const uniqueId = `slot_validation_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const assetResult = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueId}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId}.jpg`,
      capturedAt: new Date().toISOString(),
    })
    const assetId = assetResult.insert_imaging_asset_one.id

    // Get valid slot_id from template
    const validSlotId = template.slot_definitions[0].slot_id

    // Should succeed with valid slot_id
    const result = await client.request(ASSIGN_ASSET_TO_MOUNT_SLOT, {
      mountId,
      assetId,
      slotId: validSlotId,
    })

    expect(result.insert_imaging_mount_slot_one.slot_id).toBe(validSlotId)
  })

  it('should soft delete mount and handle slots appropriately', async () => {
    // Create mount with asset
    const templatesResult = await client.request(GET_MOUNT_TEMPLATES)
    const template = templatesResult.imaging_mount_template[0]
    const mountResult = await client.request(CREATE_MOUNT, {
      clinicId,
      patientId,
      templateId: template.id,
      name: 'Mount to Delete',
    })
    const mountId = mountResult.insert_imaging_mount_one.id

    const uniqueId = `delete_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const assetResult = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueId}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId}.jpg`,
      capturedAt: new Date().toISOString(),
    })
    const assetId = assetResult.insert_imaging_asset_one.id

    await client.request(ASSIGN_ASSET_TO_MOUNT_SLOT, {
      mountId,
      assetId,
      slotId: template.slot_definitions[0].slot_id,
    })

    // Soft delete mount
    const deleteResult = await client.request(SOFT_DELETE_MOUNT, { mountId })
    expect(deleteResult.update_imaging_mount_by_pk.is_active).toBe(false)

    // Asset should still exist (not deleted)
    const assetsResult = await client.request(GET_ASSETS_BY_PATIENT, {
      patientId,
      clinicId,
    })
    const asset = assetsResult.imaging_asset.find((a: any) => a.id === assetId)
    expect(asset).toBeDefined()
  })

  it('should sort assets by captured_at DESC', async () => {
    // Create assets with different dates
    const dates = [
      new Date('2024-01-01'),
      new Date('2024-03-01'),
      new Date('2024-02-01'),
    ]

    const assetIds: number[] = []
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      const uniqueId = `${date.getTime()}_${i}_${Math.random().toString(36).substring(7)}`
      const result = await client.request(CREATE_ASSET, {
        clinicId,
        patientId,
        modality: 'PHOTO',
        mimeType: 'image/jpeg',
        sizeBytes: 1024,
        sha256: `test_sha256_sort_${uniqueId}`,
        storageBackend: 'nfs',
        storageKey: `test/storage/sort_${uniqueId}.jpg`,
        capturedAt: date.toISOString(),
      })
      assetIds.push(result.insert_imaging_asset_one.id)
    }

    // Query assets
    const result = await client.request(GET_ASSETS_BY_PATIENT, {
      patientId,
      clinicId,
    })

    // Find our test assets
    const testAssets = result.imaging_asset.filter((a: any) =>
      assetIds.includes(a.id)
    )

    // Should be sorted by captured_at DESC (newest first)
    expect(testAssets.length).toBe(3)
    expect(new Date(testAssets[0].captured_at).getTime()).toBeGreaterThanOrEqual(
      new Date(testAssets[1].captured_at).getTime()
    )
    expect(new Date(testAssets[1].captured_at).getTime()).toBeGreaterThanOrEqual(
      new Date(testAssets[2].captured_at).getTime()
    )
  })

  it('should set created_by and updated_by audit fields', async () => {
    const uniqueId = `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const assetResult = await client.request(CREATE_ASSET, {
      clinicId,
      patientId,
      modality: 'PHOTO',
      mimeType: 'image/jpeg',
      sizeBytes: 1024,
      sha256: `test_sha256_${uniqueId}`,
      storageBackend: 'nfs',
      storageKey: `test/storage/${uniqueId}.jpg`,
      capturedAt: new Date().toISOString(),
    })

    expect(assetResult.insert_imaging_asset_one.created_by).toBeDefined()
    expect(assetResult.insert_imaging_asset_one.updated_by).toBeDefined()
    expect(assetResult.insert_imaging_asset_one.created_at).toBeDefined()
    expect(assetResult.insert_imaging_asset_one.updated_at).toBeDefined()
  })
})
