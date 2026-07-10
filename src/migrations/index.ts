import * as migration_20260628_154800 from './20260628_154800';
import * as migration_20260710_111115_template_fixes_settings from './20260710_111115_template_fixes_settings';

export const migrations = [
  {
    up: migration_20260628_154800.up,
    down: migration_20260628_154800.down,
    name: '20260628_154800',
  },
  {
    up: migration_20260710_111115_template_fixes_settings.up,
    down: migration_20260710_111115_template_fixes_settings.down,
    name: '20260710_111115_template_fixes_settings'
  },
];
