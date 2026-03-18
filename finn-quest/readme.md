# example structure

```
type StatName = 'strength' | 'perception' | 'endurance' | 'charisma' | 'intelligence' | 'agility' | 'luck';

type Operator = '<' | '<=' | '>' | '>=' | '==' | '!=';

interface StatRequirement {
  stat: StatName;
  value: number;
  operator: Operator;
}

interface ItemRequirement {
  itemId: string;
  quantity: number;
  operator: Operator;
}

interface GameData {
  items: Record<string, ItemDefinition>;
  lootTables: Record<string, LootTable>;
  scenes: Record<string, Scene>;
}

interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  isConsumable: boolean;
  value?: number; // For shops
}

interface LootTableEntry {
  chance: number; // 0.0 to 1.0
  itemId?: string;
  xpReward?: number;
  minQty: number;
  maxQty: number;
}

type LootTable = LootTableEntry[];

interface Scene {
  id: string;
  title: string;
  content: string;
  backgroundImg?: string;
  options: Option[];
}

interface Option {
  text: string;
  requirements?: {
    stats?: StatRequirement[];
    items?: ItemRequirement[];
    events?: string[]; // IDs of flags the player must have
  };
  // What happens if the requirements are met (or if there are no requirements)
  onSuccess: Result;
  // Optional: what happens if the player clicks but fails the check
  onFail?: Result;
  // For the "Grind" mechanic
  lootTableId?: string; 
}

interface Result {
  nextSceneId: string;
  contentOverride?: string; // Text to show instead of the next scene's default text
  rewards?: {
    xp?: number;
    stats?: Partial<Record<StatName, number>>; // Incremental boosts
    items?: { itemId: string; quantity: number }[];
    addEvents?: string[]; // Set flags like "met_king"
    removeEvents?: string[];
  };
}

interface PlayerState {
  currentSceneId: string;
  progression: {
    level: number;
    xp: number;
    statPointsAvailable: number; // For manual leveling
  };
  stats: Record<StatName, number>;
  inventory: InventoryItem[];
  eventFlags: Set<string>; // Tracks choices made or milestones reached
}

interface InventoryItem {
  id: string;
  quantity: number;
}
```
