import { NextResponse } from "next/server"
import { getMealEntries } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("📊 GET /api/nutrition/today - Calculando nutrição de hoje")
    const allMeals = getMealEntries()

    // Filtrar refeições de hoje
    const today = new Date().toDateString()
    const todayMeals = allMeals.filter((meal) => {
      const mealDate = new Date(meal.timestamp).toDateString()
      return mealDate === today
    })

    // Calcular totais
    const totals = todayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        carbs: acc.carbs + meal.carbs,
        protein: acc.protein + meal.protein,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0 },
    )

    console.log(`📊 Nutrição calculada para ${todayMeals.length} refeições:`, totals)
    return NextResponse.json(totals)
  } catch (error) {
    console.error("❌ Erro ao calcular nutrição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
