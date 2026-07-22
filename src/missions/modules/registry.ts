import type { ComponentType } from 'react'
import type { MissionType } from '@/missions/types/mission.types'
import type { MissionModuleProps } from '@/missions/modules/types'
import { RhythmicCounting } from '@/components/missions/math/RhythmicCounting'
import { Multiplication } from '@/components/missions/math/Multiplication'
import { Addition } from '@/components/missions/math/Addition'
import { Subtraction } from '@/components/missions/math/Subtraction'
import { Shapes } from '@/components/missions/math/Shapes'
import { Antonyms } from '@/components/missions/turkish/Antonyms'
import { SynonymsHomophones } from '@/components/missions/turkish/SynonymsHomophones'
import { Syllables } from '@/components/missions/turkish/Syllables'
import { Rhyme } from '@/components/missions/turkish/Rhyme'
import { HealthyChoices } from '@/components/missions/lifeSciences/HealthyChoices'
import { Seasons } from '@/components/missions/lifeSciences/Seasons'
import { Days } from '@/components/missions/lifeSciences/Days'
import { CalendarTime } from '@/components/missions/lifeSciences/CalendarTime'
import { Algorithm } from '@/components/missions/logic/Algorithm'
import { Patterns } from '@/components/missions/logic/Patterns'
import { OddOneOut } from '@/components/missions/logic/OddOneOut'
import { Riddles } from '@/components/missions/logic/Riddles'
import { TrueFalse } from '@/components/missions/logic/TrueFalse'
import { StoryOrder } from '@/components/missions/logic/StoryOrder'
import { SequenceMemory } from '@/components/missions/logic/SequenceMemory'
import { Sudoku } from '@/components/missions/logic/Sudoku'
import { NumberSudoku } from '@/components/missions/logic/NumberSudoku'
import { MissingNumber } from '@/components/missions/math/MissingNumber'

const MISSION_COMPONENTS: Partial<Record<MissionType, ComponentType<MissionModuleProps>>> = {
  'rhythmic-counting': RhythmicCounting,
  multiplication: Multiplication,
  addition: Addition,
  subtraction: Subtraction,
  shapes: Shapes,
  opposites: Antonyms,
  'synonyms-homophones': SynonymsHomophones,
  syllables: Syllables,
  rhyme: Rhyme,
  'healthy-food': HealthyChoices,
  seasons: Seasons,
  days: Days,
  'calendar-time': CalendarTime,
  algorithm: Algorithm,
  patterns: Patterns,
  'missing-number': MissingNumber,
  'odd-one-out': OddOneOut,
  riddles: Riddles,
  'true-false': TrueFalse,
  'story-order': StoryOrder,
  'sequence-memory': SequenceMemory,
  sudoku: Sudoku,
  'number-sudoku': NumberSudoku,
}

export function getMissionComponent(
  type: MissionType,
): ComponentType<MissionModuleProps> | null {
  return MISSION_COMPONENTS[type] ?? null
}

export function hasRealModule(type: MissionType): boolean {
  return type in MISSION_COMPONENTS
}
