import { NextResponse } from "next/server"
import { getMealEntries } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("📅 GET /api/meals/today - Buscando refeições de hoje")
    const allMeals = getMealEntries()

    // Filtrar refeições de hoje
    const today = new Date().toDateString()
    const todayMeals = allMeals.filter((meal) => {
      const mealDate = new Date(meal.timestamp).toDateString()
      return mealDate === today
    })

    console.log(`📊 Refeições de hoje: ${todayMeals.length} de ${allMeals.length} total`)
    return NextResponse.json(todayMeals)
  } catch (error) {
    console.error("❌ Erro ao buscar refeições de hoje:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
