/**
 * Mount Template Definitions (canvas format)
 *
 * Templates use a fixed 2000×1000 canvas. Each slot has x, y, width, height in mount pixels.
 */

import { MOUNT_CANVAS_WIDTH, MOUNT_CANVAS_HEIGHT } from '../api/mounts'

export interface MountSlotDefinitionCanvas {
  slot_id: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

export interface MountTemplate {
  template_key: string
  name: string
  description: string | null
  slot_definitions: MountSlotDefinitionCanvas[]
  layout_config: {
    type: 'canvas'
    width: number
    height: number
  }
}

const LAYOUT = {
  type: 'canvas' as const,
  width: MOUNT_CANVAS_WIDTH,
  height: MOUNT_CANVAS_HEIGHT,
}

export const MOUNT_TEMPLATES: MountTemplate[] = [
  {
    template_key: 'two_horizontal',
    name: 'Two Side-by-Side',
    description: 'Two images displayed horizontally',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Left', x: 0, y: 0, width: 1000, height: 1000 },
      { slot_id: 'slot_2', label: 'Right', x: 1000, y: 0, width: 1000, height: 1000 },
    ],
  },
  {
    template_key: 'single',
    name: 'Single Image',
    description: 'Single image display',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Image', x: 0, y: 0, width: 2000, height: 1000 },
    ],
  },
  {
    template_key: 'three_horizontal',
    name: 'Three Horizontal',
    description: 'Three images displayed horizontally',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Left', x: 0, y: 0, width: 666.67, height: 1000 },
      { slot_id: 'slot_2', label: 'Center', x: 666.67, y: 0, width: 666.67, height: 1000 },
      { slot_id: 'slot_3', label: 'Right', x: 1333.33, y: 0, width: 666.67, height: 1000 },
    ],
  },
  {
    template_key: 'four_grid',
    name: 'Four Grid (2x2)',
    description: 'Four images in a 2x2 grid',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top Left', x: 0, y: 0, width: 1000, height: 500 },
      { slot_id: 'slot_2', label: 'Top Right', x: 1000, y: 0, width: 1000, height: 500 },
      { slot_id: 'slot_3', label: 'Bottom Left', x: 0, y: 500, width: 1000, height: 500 },
      { slot_id: 'slot_4', label: 'Bottom Right', x: 1000, y: 500, width: 1000, height: 500 },
    ],
  },
  {
    template_key: 'two_vertical',
    name: 'Two Vertical',
    description: 'Two images displayed vertically',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top', x: 0, y: 0, width: 2000, height: 500 },
      { slot_id: 'slot_2', label: 'Bottom', x: 0, y: 500, width: 2000, height: 500 },
    ],
  },
  {
    template_key: 'six_horizontal',
    name: 'Six Horizontal',
    description: 'Six images displayed horizontally',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Position 1', x: 0, y: 0, width: 333.33, height: 1000 },
      { slot_id: 'slot_2', label: 'Position 2', x: 333.33, y: 0, width: 333.33, height: 1000 },
      { slot_id: 'slot_3', label: 'Position 3', x: 666.67, y: 0, width: 333.33, height: 1000 },
      { slot_id: 'slot_4', label: 'Position 4', x: 1000, y: 0, width: 333.33, height: 1000 },
      { slot_id: 'slot_5', label: 'Position 5', x: 1333.33, y: 0, width: 333.33, height: 1000 },
      { slot_id: 'slot_6', label: 'Position 6', x: 1666.67, y: 0, width: 333.33, height: 1000 },
    ],
  },
  {
    template_key: 'complex_grid_3x3',
    name: 'Complex Grid (3x3 with gaps)',
    description: 'Three rows with gaps in middle row',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top Left', x: 0, y: 0, width: 666.67, height: 333.33 },
      { slot_id: 'slot_2', label: 'Top Center', x: 666.67, y: 0, width: 666.67, height: 333.33 },
      { slot_id: 'slot_3', label: 'Top Right', x: 1333.33, y: 0, width: 666.67, height: 333.33 },
      { slot_id: 'slot_4', label: 'Middle Left', x: 0, y: 333.33, width: 666.67, height: 333.34 },
      { slot_id: 'slot_5', label: 'Middle Right', x: 1333.33, y: 333.33, width: 666.67, height: 333.34 },
      { slot_id: 'slot_6', label: 'Bottom Left', x: 0, y: 666.67, width: 666.67, height: 333.33 },
      { slot_id: 'slot_7', label: 'Bottom Center', x: 666.67, y: 666.67, width: 666.67, height: 333.33 },
      { slot_id: 'slot_8', label: 'Bottom Right', x: 1333.33, y: 666.67, width: 666.67, height: 333.33 },
    ],
  },
  {
    template_key: 'four_horizontal',
    name: 'Four Horizontal',
    description: 'Four images displayed horizontally',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Position 1', x: 0, y: 0, width: 500, height: 1000 },
      { slot_id: 'slot_2', label: 'Position 2', x: 500, y: 0, width: 500, height: 1000 },
      { slot_id: 'slot_3', label: 'Position 3', x: 1000, y: 0, width: 500, height: 1000 },
      { slot_id: 'slot_4', label: 'Position 4', x: 1500, y: 0, width: 500, height: 1000 },
    ],
  },
  {
    template_key: 'cross_pattern',
    name: 'Cross Pattern',
    description: 'Cross-shaped layout with center and four arms',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top', x: 666.67, y: 0, width: 666.67, height: 333.33 },
      { slot_id: 'slot_2', label: 'Left', x: 0, y: 333.33, width: 666.67, height: 333.34 },
      { slot_id: 'slot_3', label: 'Center', x: 666.67, y: 333.33, width: 666.67, height: 333.34 },
      { slot_id: 'slot_4', label: 'Right', x: 1333.33, y: 333.33, width: 666.67, height: 333.34 },
      { slot_id: 'slot_5', label: 'Bottom', x: 666.67, y: 666.67, width: 666.67, height: 333.33 },
    ],
  },
  {
    template_key: 'five_horizontal',
    name: 'Five Horizontal',
    description: 'Five images displayed horizontally',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Position 1', x: 0, y: 0, width: 400, height: 1000 },
      { slot_id: 'slot_2', label: 'Position 2', x: 400, y: 0, width: 400, height: 1000 },
      { slot_id: 'slot_3', label: 'Position 3', x: 800, y: 0, width: 400, height: 1000 },
      { slot_id: 'slot_4', label: 'Position 4', x: 1200, y: 0, width: 400, height: 1000 },
      { slot_id: 'slot_5', label: 'Position 5', x: 1600, y: 0, width: 400, height: 1000 },
    ],
  },
  {
    template_key: 'complex_grid_3x5',
    name: 'Complex Grid (3x5 with gaps)',
    description: 'Three rows, five columns with gaps in middle row',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top 1', x: 0, y: 0, width: 400, height: 333.33 },
      { slot_id: 'slot_2', label: 'Top 2', x: 400, y: 0, width: 400, height: 333.33 },
      { slot_id: 'slot_3', label: 'Top 3', x: 800, y: 0, width: 400, height: 333.33 },
      { slot_id: 'slot_4', label: 'Top 4', x: 1200, y: 0, width: 400, height: 333.33 },
      { slot_id: 'slot_5', label: 'Top 5', x: 1600, y: 0, width: 400, height: 333.33 },
      { slot_id: 'slot_6', label: 'Middle Left', x: 0, y: 333.33, width: 400, height: 333.34 },
      { slot_id: 'slot_7', label: 'Middle Right', x: 1600, y: 333.33, width: 400, height: 333.34 },
      { slot_id: 'slot_8', label: 'Bottom 1', x: 0, y: 666.67, width: 400, height: 333.33 },
      { slot_id: 'slot_9', label: 'Bottom 2', x: 400, y: 666.67, width: 400, height: 333.33 },
      { slot_id: 'slot_10', label: 'Bottom 3', x: 800, y: 666.67, width: 400, height: 333.33 },
      { slot_id: 'slot_11', label: 'Bottom 4', x: 1200, y: 666.67, width: 400, height: 333.33 },
      { slot_id: 'slot_12', label: 'Bottom 5', x: 1600, y: 666.67, width: 400, height: 333.33 },
    ],
  },
  {
    template_key: 'large_cross',
    name: 'Large Cross Pattern',
    description: 'Large cross-shaped layout with center and four extended arms',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'slot_1', label: 'Top', x: 1000, y: 0, width: 500, height: 333.33 },
      { slot_id: 'slot_2', label: 'Left', x: 0, y: 333.33, width: 500, height: 333.34 },
      { slot_id: 'slot_3', label: 'Center', x: 500, y: 333.33, width: 500, height: 333.34 },
      { slot_id: 'slot_4', label: 'Center Right', x: 1000, y: 333.33, width: 500, height: 333.34 },
      { slot_id: 'slot_5', label: 'Right', x: 1500, y: 333.33, width: 500, height: 333.34 },
      { slot_id: 'slot_6', label: 'Bottom', x: 1000, y: 666.67, width: 500, height: 333.33 },
    ],
  },
  {
    template_key: 'full_mouth_series',
    name: 'Full Mouth Series',
    description: 'Standard full mouth series layout (18 images)',
    layout_config: LAYOUT,
    slot_definitions: [
      { slot_id: 'fms_ur1', label: 'UR1', x: 0, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ur2', label: 'UR2', x: 125, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ur3', label: 'UR3', x: 250, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ur4', label: 'UR4', x: 375, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ur5', label: 'UR5', x: 500, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ur6', label: 'UR6', x: 625, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ur7', label: 'UR7', x: 750, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ur8', label: 'UR8', x: 875, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul1', label: 'UL1', x: 1000, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul2', label: 'UL2', x: 1125, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul3', label: 'UL3', x: 1250, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul4', label: 'UL4', x: 1375, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul5', label: 'UL5', x: 1500, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul6', label: 'UL6', x: 1625, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul7', label: 'UL7', x: 1750, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_ul8', label: 'UL8', x: 1875, y: 0, width: 125, height: 500 },
      { slot_id: 'fms_bwx_r', label: 'BWX Right', x: 0, y: 500, width: 1000, height: 500 },
      { slot_id: 'fms_bwx_l', label: 'BWX Left', x: 1000, y: 500, width: 1000, height: 500 },
    ],
  },
]

/**
 * Get a template by its key
 */
export function getMountTemplate(templateKey: string): MountTemplate | undefined {
  return MOUNT_TEMPLATES.find((t) => t.template_key === templateKey)
}

/**
 * Get all active templates
 */
export function getAllMountTemplates(): MountTemplate[] {
  return MOUNT_TEMPLATES
}
