import { type NextRequest, NextResponse } from "next/server"
import { deleteMealEntry } from "@/lib/data-store"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log(`🗑️ DELETE /api/meals/${id} - Tentando deletar refeição`)

    if (!id) {
      console.error("❌ ID não fornecido")
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    const deleted = deleteMealEntry(id)

    if (!deleted) {
      console.error(`❌ Refeição com ID ${id} não encontrada`)
      return NextResponse.json({ error: "Refeição não encontrada" }, { status: 404 })
    }

    console.log(`✅ Refeição ${id} deletada com sucesso`)
    return NextResponse.json({ message: "Refeição deletada com sucesso" })
  } catch (error) {
    console.error("❌ Erro ao deletar refeição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
