// Tipos de dados
export interface GlucoseReading {
  id: string
  value: number
  timestamp: string
  notes?: string
}

export interface MealEntry {
  id: string
  foodName: string
  quantity: number
  unit: string
  calories: number
  carbs: number
  protein: number
  fat: number
  timestamp: string
}

export interface Food {
  id: string
  name: string
  calories_per_100g: number
  carbs_per_100g: number
  protein_per_100g: number
  fat_per_100g: number
  unit: string
}

// Armazenamento em memória
let glucoseStore: GlucoseReading[] = [
  {
    id: "1",
    value: 120,
    timestamp: new Date().toISOString(),
    notes: "Jejum",
  },
  {
    id: "2",
    value: 140,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notes: "Pós-refeição",
  },
]

let mealStore: MealEntry[] = [
  {
    id: "1",
    foodName: "Arroz integral",
    quantity: 100,
    unit: "g",
    calories: 111,
    carbs: 23,
    protein: 2.6,
    fat: 0.9,
    timestamp: new Date().toISOString(),
  },
]

const foodStore: Food[] = [
  {
    id: "1",
    name: "Arroz integral",
    calories_per_100g: 111,
    carbs_per_100g: 23,
    protein_per_100g: 2.6,
    fat_per_100g: 0.9,
    unit: "g",
  },
  {
    id: "2",
    name: "Frango grelhado",
    calories_per_100g: 165,
    carbs_per_100g: 0,
    protein_per_100g: 31,
    fat_per_100g: 3.6,
    unit: "g",
  },
  {
    id: "3",
    name: "Brócolis",
    calories_per_100g: 34,
    carbs_per_100g: 7,
    protein_per_100g: 2.8,
    fat_per_100g: 0.4,
    unit: "g",
  },
  {
    id: "4",
    name: "Batata doce",
    calories_per_100g: 86,
    carbs_per_100g: 20,
    protein_per_100g: 1.6,
    fat_per_100g: 0.1,
    unit: "g",
  },
  {
    id: "5",
    name: "Aveia",
    calories_per_100g: 389,
    carbs_per_100g: 66,
    protein_per_100g: 17,
    fat_per_100g: 7,
    unit: "g",
  },
]

// Funções para Glicose
export const getGlucoseReadings = (): GlucoseReading[] => {
  console.log("📊 Buscando leituras de glicose:", glucoseStore.length, "registros")
  return [...glucoseStore]
}

export const addGlucoseReading = (reading: Omit<GlucoseReading, "id">): GlucoseReading => {
  const newReading: GlucoseReading = {
    ...reading,
    id: (glucoseStore.length + 1).toString(),
  }
  glucoseStore.push(newReading)
  console.log("✅ Nova leitura de glicose adicionada:", newReading)
  return newReading
}

export const deleteGlucoseReading = (id: string): boolean => {
  const initialLength = glucoseStore.length
  glucoseStore = glucoseStore.filter((reading) => reading.id !== id)
  const deleted = glucoseStore.length < initialLength
  console.log(`🗑️ Tentativa de deletar glicose ID ${id}:`, deleted ? "Sucesso" : "Falhou")
  if (!deleted) {
    console.log(
      "📋 IDs disponíveis:",
      glucoseStore.map((r) => r.id),
    )
  }
  return deleted
}

// Funções para Refeições
export const getMealEntries = (): MealEntry[] => {
  console.log("🍽️ Buscando entradas de refeição:", mealStore.length, "registros")
  return [...mealStore]
}

export const addMealEntry = (entry: Omit<MealEntry, "id">): MealEntry => {
  const newEntry: MealEntry = {
    ...entry,
    id: (mealStore.length + 1).toString(),
  }
  mealStore.push(newEntry)
  console.log("✅ Nova entrada de refeição adicionada:", newEntry)
  return newEntry
}

export const deleteMealEntry = (id: string): boolean => {
  const initialLength = mealStore.length
  mealStore = mealStore.filter((entry) => entry.id !== id)
  const deleted = mealStore.length < initialLength
  console.log(`🗑️ Tentativa de deletar refeição ID ${id}:`, deleted ? "Sucesso" : "Falhou")
  if (!deleted) {
    console.log(
      "📋 IDs de refeições disponíveis:",
      mealStore.map((m) => m.id),
    )
  }
  return deleted
}

// Funções para Alimentos
export const getFoods = (): Food[] => {
  console.log("🥗 Buscando alimentos:", foodStore.length, "registros")
  return [...foodStore]
}

export const addFood = (food: Omit<Food, "id">): Food => {
  const newFood: Food = {
    ...food,
    id: (foodStore.length + 1).toString(),
  }
  foodStore.push(newFood)
  console.log("✅ Novo alimento adicionado:", newFood)
  return newFood
}
