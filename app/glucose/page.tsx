"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface GlucoseReading {
  id: number
  value: number
  timestamp: string
  period: "fasting" | "post_meal" | "bedtime"
  notes?: string
}

export default function GlucosePage() {
  const [readings, setReadings] = useState<GlucoseReading[]>([])
  const [newReading, setNewReading] = useState({
    value: "",
    period: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchReadings()
  }, [])

  const fetchReadings = async () => {
    try {
      const response = await fetch("/api/glucose")
      const data = await response.json()
      setReadings(data)
    } catch (error) {
      console.error("Error fetching readings:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReading.value || !newReading.period) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/glucose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: Number.parseInt(newReading.value),
          period: newReading.period,
          notes: newReading.notes,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Medição registrada com sucesso!",
        })
        setNewReading({ value: "", period: "", notes: "" })
        fetchReadings()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar medição.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteReading = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta medição?")) {
      return
    }

    try {
      console.log(`Tentando deletar medição com ID: ${id}`)

      const response = await fetch(`/api/glucose/${id}`, {
        method: "DELETE",
      })

      console.log(`Resposta da API:`, response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log("Medição deletada com sucesso:", result)

        toast({
          title: "Sucesso",
          description: "Medição removida com sucesso!",
        })

        // Recarregar os dados
        await fetchReadings()
      } else {
        const errorData = await response.json()
        console.error("Erro na resposta:", errorData)

        toast({
          title: "Erro",
          description: errorData.error || "Erro ao remover medição.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      toast({
        title: "Erro",
        description: "Erro de conexão ao remover medição.",
        variant: "destructive",
      })
    }
  }

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: "Baixa", color: "bg-red-500" }
    if (value <= 140) return { status: "Normal", color: "bg-green-500" }
    return { status: "Alta", color: "bg-yellow-500" }
  }

  const getPeriodLabel = (period: string) => {
    const labels = {
      fasting: "Jejum",
      post_meal: "Pós-refeição",
      bedtime: "Antes de dormir",
    }
    return labels[period as keyof typeof labels] || period
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Controle Glicêmico</h1>
            <p className="text-gray-600">Registre e monitore suas medições de glicemia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nova Medição
              </CardTitle>
              <CardDescription>Registre uma nova medição de glicemia</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="value">Valor (mg/dL) *</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="Ex: 120"
                    value={newReading.value}
                    onChange={(e) => setNewReading((prev) => ({ ...prev, value: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="period">Período *</Label>
                  <Select
                    value={newReading.period}
                    onValueChange={(value) => setNewReading((prev) => ({ ...prev, period: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fasting">Jejum</SelectItem>
                      <SelectItem value="post_meal">Pós-refeição</SelectItem>
                      <SelectItem value="bedtime">Antes de dormir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    placeholder="Ex: Após exercício, estresse..."
                    value={newReading.notes}
                    onChange={(e) => setNewReading((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registrando..." : "Registrar Medição"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Readings List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Histórico de Medições</CardTitle>
              <CardDescription>Suas medições mais recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {readings.map((reading) => {
                  const status = getGlucoseStatus(reading.value)
                  return (
                    <div key={reading.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${status.color}`}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{reading.value} mg/dL</span>
                            <Badge variant="outline">{getPeriodLabel(reading.period)}</Badge>
                            <Badge className={`${status.color} text-white`}>{status.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(reading.timestamp).toLocaleString("pt-BR")}
                          </p>
                          {reading.notes && <p className="text-sm text-gray-600 mt-1">{reading.notes}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReading(reading.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
                {readings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma medição registrada ainda.</p>
                    <p className="text-sm">Registre sua primeira medição usando o formulário ao lado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
