/**
 * Mount Template Definitions
 * 
 * These templates define the layout and slot structure for imaging mounts.
 * Each template has a unique key, display name, and slot definitions.
 * 
 * Slot definitions include:
 * - slot_id: Unique identifier within the template (e.g., "slot_1", "slot_2")
 * - label: Human-readable label for the slot
 * - row: Row position in the grid (0-indexed)
 * - col: Column position in the grid (0-indexed)
 */

export interface MountSlotDefinition {
  slot_id: string
  label: string
  row: number
  col: number
}

export interface MountTemplate {
  template_key: string
  name: string
  description: string | null
  slot_definitions: MountSlotDefinition[]
  layout_config?: {
    rows?: number
    cols?: number
    aspectRatio?: string
  }
}

export const MOUNT_TEMPLATES: MountTemplate[] = [
  {
    template_key: 'two_horizontal',
    name: 'Two Side-by-Side',
    description: 'Two images displayed horizontally',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Left', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Right', row: 0, col: 1 },
    ],
    layout_config: { rows: 1, cols: 2, aspectRatio: '2:1' },
  },
  {
    template_key: 'single',
    name: 'Single Image',
    description: 'Single image display',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Image', row: 0, col: 0 },
    ],
    layout_config: { rows: 1, cols: 1, aspectRatio: '1:1' },
  },
  {
    template_key: 'three_horizontal',
    name: 'Three Horizontal',
    description: 'Three images displayed horizontally',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Left', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Center', row: 0, col: 1 },
      { slot_id: 'slot_3', label: 'Right', row: 0, col: 2 },
    ],
    layout_config: { rows: 1, cols: 3, aspectRatio: '3:1' },
  },
  {
    template_key: 'four_grid',
    name: 'Four Grid (2x2)',
    description: 'Four images in a 2x2 grid',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top Left', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Top Right', row: 0, col: 1 },
      { slot_id: 'slot_3', label: 'Bottom Left', row: 1, col: 0 },
      { slot_id: 'slot_4', label: 'Bottom Right', row: 1, col: 1 },
    ],
    layout_config: { rows: 2, cols: 2, aspectRatio: '1:1' },
  },
  {
    template_key: 'two_vertical',
    name: 'Two Vertical',
    description: 'Two images displayed vertically',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Bottom', row: 1, col: 0 },
    ],
    layout_config: { rows: 2, cols: 1, aspectRatio: '1:2' },
  },
  {
    template_key: 'six_horizontal',
    name: 'Six Horizontal',
    description: 'Six images displayed horizontally',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Position 1', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Position 2', row: 0, col: 1 },
      { slot_id: 'slot_3', label: 'Position 3', row: 0, col: 2 },
      { slot_id: 'slot_4', label: 'Position 4', row: 0, col: 3 },
      { slot_id: 'slot_5', label: 'Position 5', row: 0, col: 4 },
      { slot_id: 'slot_6', label: 'Position 6', row: 0, col: 5 },
    ],
    layout_config: { rows: 1, cols: 6, aspectRatio: '6:1' },
  },
  {
    template_key: 'complex_grid_3x3',
    name: 'Complex Grid (3x3 with gaps)',
    description: 'Three rows with gaps in middle row',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top Left', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Top Center', row: 0, col: 1 },
      { slot_id: 'slot_3', label: 'Top Right', row: 0, col: 2 },
      { slot_id: 'slot_4', label: 'Middle Left', row: 1, col: 0 },
      { slot_id: 'slot_5', label: 'Middle Right', row: 1, col: 2 },
      { slot_id: 'slot_6', label: 'Bottom Left', row: 2, col: 0 },
      { slot_id: 'slot_7', label: 'Bottom Center', row: 2, col: 1 },
      { slot_id: 'slot_8', label: 'Bottom Right', row: 2, col: 2 },
    ],
    layout_config: { rows: 3, cols: 3, aspectRatio: '1:1' },
  },
  {
    template_key: 'four_horizontal',
    name: 'Four Horizontal',
    description: 'Four images displayed horizontally',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Position 1', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Position 2', row: 0, col: 1 },
      { slot_id: 'slot_3', label: 'Position 3', row: 0, col: 2 },
      { slot_id: 'slot_4', label: 'Position 4', row: 0, col: 3 },
    ],
    layout_config: { rows: 1, cols: 4, aspectRatio: '4:1' },
  },
  {
    template_key: 'cross_pattern',
    name: 'Cross Pattern',
    description: 'Cross-shaped layout with center and four arms',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top', row: 0, col: 1 },
      { slot_id: 'slot_2', label: 'Left', row: 1, col: 0 },
      { slot_id: 'slot_3', label: 'Center', row: 1, col: 1 },
      { slot_id: 'slot_4', label: 'Right', row: 1, col: 2 },
      { slot_id: 'slot_5', label: 'Bottom', row: 2, col: 1 },
    ],
    layout_config: { rows: 3, cols: 3, aspectRatio: '1:1' },
  },
  {
    template_key: 'five_horizontal',
    name: 'Five Horizontal',
    description: 'Five images displayed horizontally',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Position 1', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Position 2', row: 0, col: 1 },
      { slot_id: 'slot_3', label: 'Position 3', row: 0, col: 2 },
      { slot_id: 'slot_4', label: 'Position 4', row: 0, col: 3 },
      { slot_id: 'slot_5', label: 'Position 5', row: 0, col: 4 },
    ],
    layout_config: { rows: 1, cols: 5, aspectRatio: '5:1' },
  },
  {
    template_key: 'complex_grid_3x5',
    name: 'Complex Grid (3x5 with gaps)',
    description: 'Three rows, five columns with gaps in middle row',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top 1', row: 0, col: 0 },
      { slot_id: 'slot_2', label: 'Top 2', row: 0, col: 1 },
      { slot_id: 'slot_3', label: 'Top 3', row: 0, col: 2 },
      { slot_id: 'slot_4', label: 'Top 4', row: 0, col: 3 },
      { slot_id: 'slot_5', label: 'Top 5', row: 0, col: 4 },
      { slot_id: 'slot_6', label: 'Middle Left', row: 1, col: 0 },
      { slot_id: 'slot_7', label: 'Middle Right', row: 1, col: 4 },
      { slot_id: 'slot_8', label: 'Bottom 1', row: 2, col: 0 },
      { slot_id: 'slot_9', label: 'Bottom 2', row: 2, col: 1 },
      { slot_id: 'slot_10', label: 'Bottom 3', row: 2, col: 2 },
      { slot_id: 'slot_11', label: 'Bottom 4', row: 2, col: 3 },
      { slot_id: 'slot_12', label: 'Bottom 5', row: 2, col: 4 },
    ],
    layout_config: { rows: 3, cols: 5, aspectRatio: '5:3' },
  },
  {
    template_key: 'large_cross',
    name: 'Large Cross Pattern',
    description: 'Large cross-shaped layout with center and four extended arms',
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top', row: 0, col: 2 },
      { slot_id: 'slot_2', label: 'Left', row: 1, col: 0 },
      { slot_id: 'slot_3', label: 'Center', row: 1, col: 1 },
      { slot_id: 'slot_4', label: 'Center Right', row: 1, col: 2 },
      { slot_id: 'slot_5', label: 'Right', row: 1, col: 3 },
      { slot_id: 'slot_6', label: 'Bottom', row: 2, col: 2 },
    ],
    layout_config: { rows: 3, cols: 4, aspectRatio: '4:3' },
  },
  {
    template_key: 'full_mouth_series',
    name: 'Full Mouth Series',
    description: 'Standard full mouth series layout (18 images)',
    slot_definitions: [
      // Periapicals - Maxillary
      { slot_id: 'fms_ur1', label: 'UR1', row: 0, col: 0 },
      { slot_id: 'fms_ur2', label: 'UR2', row: 0, col: 1 },
      { slot_id: 'fms_ur3', label: 'UR3', row: 0, col: 2 },
      { slot_id: 'fms_ur4', label: 'UR4', row: 0, col: 3 },
      { slot_id: 'fms_ur5', label: 'UR5', row: 0, col: 4 },
      { slot_id: 'fms_ur6', label: 'UR6', row: 0, col: 5 },
      { slot_id: 'fms_ur7', label: 'UR7', row: 0, col: 6 },
      { slot_id: 'fms_ur8', label: 'UR8', row: 0, col: 7 },
      { slot_id: 'fms_ul1', label: 'UL1', row: 0, col: 8 },
      { slot_id: 'fms_ul2', label: 'UL2', row: 0, col: 9 },
      { slot_id: 'fms_ul3', label: 'UL3', row: 0, col: 10 },
      { slot_id: 'fms_ul4', label: 'UL4', row: 0, col: 11 },
      { slot_id: 'fms_ul5', label: 'UL5', row: 0, col: 12 },
      { slot_id: 'fms_ul6', label: 'UL6', row: 0, col: 13 },
      { slot_id: 'fms_ul7', label: 'UL7', row: 0, col: 14 },
      { slot_id: 'fms_ul8', label: 'UL8', row: 0, col: 15 },
      // Bitewings
      { slot_id: 'fms_bwx_r', label: 'BWX Right', row: 1, col: 0 },
      { slot_id: 'fms_bwx_l', label: 'BWX Left', row: 1, col: 1 },
    ],
    layout_config: { rows: 2, cols: 16, aspectRatio: '16:2' },
  },
]

/**
 * Get a template by its key
 */
export function getMountTemplate(templateKey: string): MountTemplate | undefined {
  return MOUNT_TEMPLATES.find(t => t.template_key === templateKey)
}

/**
 * Get all active templates
 */
export function getAllMountTemplates(): MountTemplate[] {
  return MOUNT_TEMPLATES
}
