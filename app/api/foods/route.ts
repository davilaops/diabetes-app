import { NextResponse } from "next/server"
import { getFoods } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("🥗 GET /api/foods - Buscando alimentos disponíveis")
    const foods = getFoods()
    console.log(`📊 Alimentos encontrados: ${foods.length}`)
    return NextResponse.json(foods)
  } catch (error) {
    console.error("❌ Erro ao buscar alimentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
