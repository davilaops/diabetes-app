import { type NextRequest, NextResponse } from "next/server"
import { glucoseStore } from "@/lib/data-store"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    console.log(`Tentando deletar glicemia com ID: ${id}`)

    // Verificar se a leitura existe antes de tentar deletar
    const reading = glucoseStore.getById(id)
    if (!reading) {
      console.log(`Glicemia com ID ${id} não encontrada`)
      console.log(
        "Leituras disponíveis:",
        glucoseStore.getAll().map((r) => ({ id: r.id, value: r.value })),
      )
      return NextResponse.json({ error: "Reading not found" }, { status: 404 })
    }

    // Deletar a leitura
    const deleted = glucoseStore.delete(id)

    if (deleted) {
      console.log(`Glicemia com ID ${id} deletada com sucesso`)
      return NextResponse.json({
        message: "Reading deleted successfully",
        deletedReading: reading,
      })
    } else {
      return NextResponse.json({ error: "Failed to delete reading" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao deletar glicemia:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
