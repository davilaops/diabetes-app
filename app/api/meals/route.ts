import { type NextRequest, NextResponse } from "next/server"
import { getMealEntries, addMealEntry } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("🔍 GET /api/meals - Buscando todas as refeições")
    const meals = getMealEntries()
    console.log("📊 Refeições encontradas:", meals.length)
    return NextResponse.json(meals)
  } catch (error) {
    console.error("❌ Erro ao buscar refeições:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📝 POST /api/meals - Adicionando nova refeição")
    const body = await request.json()
    console.log("📦 Dados recebidos:", body)

    // Validação dos dados obrigatórios
    const requiredFields = ["foodName", "quantity", "unit", "calories", "carbs", "protein", "fat"]
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        console.error(`❌ Campo obrigatório ausente: ${field}`)
        return NextResponse.json({ error: `Campo obrigatório: ${field}` }, { status: 400 })
      }
    }

    // Criar entrada de refeição
    const mealEntry = {
      foodName: body.foodName,
      quantity: Number(body.quantity),
      unit: body.unit,
      calories: Number(body.calories),
      carbs: Number(body.carbs),
      protein: Number(body.protein),
      fat: Number(body.fat),
      timestamp: body.timestamp || new Date().toISOString(),
    }

    console.log("🍽️ Criando entrada de refeição:", mealEntry)
    const newMeal = addMealEntry(mealEntry)
    console.log("✅ Refeição criada com sucesso:", newMeal)

    return NextResponse.json(newMeal, { status: 201 })
  } catch (error) {
    console.error("❌ Erro ao criar refeição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
