"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Apple, Calendar, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

interface GlucoseReading {
  id: number
  value: number
  timestamp: string
  period: "fasting" | "post_meal" | "bedtime"
}

interface NutritionSummary {
  calories: number
  carbs: number
  protein: number
  fat: number
  targetCalories: number
  targetCarbs: number
  targetProtein: number
  targetFat: number
}

export default function Dashboard() {
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([])
  const [nutrition, setNutrition] = useState<NutritionSummary>({
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    targetCalories: 2000,
    targetCarbs: 250,
    targetProtein: 150,
    targetFat: 67,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch glucose readings
      const glucoseResponse = await fetch("/api/glucose/recent")
      const glucoseData = await glucoseResponse.json()
      setGlucoseReadings(glucoseData)

      // Fetch today's nutrition
      const nutritionResponse = await fetch("/api/nutrition/today")
      const nutritionData = await nutritionResponse.json()
      setNutrition((prev) => ({ ...prev, ...nutritionData }))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGlucoseAverage = (period: "day" | "week" | "month") => {
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "day":
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setDate(now.getDate() - 30)
        break
    }

    const filteredReadings = glucoseReadings.filter((reading) => new Date(reading.timestamp) >= startDate)

    if (filteredReadings.length === 0) return 0

    const sum = filteredReadings.reduce((acc, reading) => acc + reading.value, 0)
    return Math.round(sum / filteredReadings.length)
  }

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: "Baixa", color: "bg-red-500", icon: TrendingDown }
    if (value <= 140) return { status: "Normal", color: "bg-green-500", icon: Minus }
    return { status: "Alta", color: "bg-yellow-500", icon: TrendingUp }
  }

  const latestGlucose = glucoseReadings[0]
  const glucoseStatus = latestGlucose ? getGlucoseStatus(latestGlucose.value) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DiabetesApp</h1>
            <p className="text-gray-600">Gerencie sua diabetes de forma inteligente</p>
          </div>
          <div className="flex gap-2">
            <Link href="/glucose">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Registrar Glicemia
              </Button>
            </Link>
            <Link href="/nutrition">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Apple className="w-4 h-4" />
                Registrar Refeição
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Glicemia Atual</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestGlucose ? `${latestGlucose.value} mg/dL` : "N/A"}</div>
              {glucoseStatus && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${glucoseStatus.color} text-white`}>{glucoseStatus.status}</Badge>
                  <glucoseStatus.icon className="w-4 h-4" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Semanal</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getGlucoseAverage("week")} mg/dL</div>
              <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getGlucoseAverage("month")} mg/dL</div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calorias Hoje</CardTitle>
              <Apple className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nutrition.calories}</div>
              <Progress value={(nutrition.calories / nutrition.targetCalories) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="glucose" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="glucose">Controle Glicêmico</TabsTrigger>
            <TabsTrigger value="nutrition">Controle Nutricional</TabsTrigger>
          </TabsList>

          <TabsContent value="glucose" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Últimas Medições</CardTitle>
                  <CardDescription>Suas medições de glicemia mais recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {glucoseReadings.slice(0, 5).map((reading) => {
                      const status = getGlucoseStatus(reading.value)
                      return (
                        <div key={reading.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                            <div>
                              <p className="font-medium">{reading.value} mg/dL</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(reading.timestamp).toLocaleString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {reading.period.replace("_", " ")}
                          </Badge>
                        </div>
                      )
                    })}
                    {glucoseReadings.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Nenhuma medição registrada ainda</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Médias</CardTitle>
                  <CardDescription>Suas médias por período</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hoje</span>
                    <span className="text-lg font-bold">{getGlucoseAverage("day")} mg/dL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">7 dias</span>
                    <span className="text-lg font-bold">{getGlucoseAverage("week")} mg/dL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">30 dias</span>
                    <span className="text-lg font-bold">{getGlucoseAverage("month")} mg/dL</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Macronutrientes Hoje</CardTitle>
                  <CardDescription>Progresso dos seus macros diários</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Carboidratos</span>
                      <span className="text-sm">
                        {nutrition.carbs}g / {nutrition.targetCarbs}g
                      </span>
                    </div>
                    <Progress value={(nutrition.carbs / nutrition.targetCarbs) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Proteínas</span>
                      <span className="text-sm">
                        {nutrition.protein}g / {nutrition.targetProtein}g
                      </span>
                    </div>
                    <Progress value={(nutrition.protein / nutrition.targetProtein) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Gorduras</span>
                      <span className="text-sm">
                        {nutrition.fat}g / {nutrition.targetFat}g
                      </span>
                    </div>
                    <Progress value={(nutrition.fat / nutrition.targetFat) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo Calórico</CardTitle>
                  <CardDescription>Balanço energético do dia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-3xl font-bold">{nutrition.calories}</p>
                      <p className="text-muted-foreground">calorias consumidas</p>
                    </div>
                    <Progress value={(nutrition.calories / nutrition.targetCalories) * 100} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span>Meta: {nutrition.targetCalories} kcal</span>
                      <span>
                        {nutrition.targetCalories - nutrition.calories > 0
                          ? `Restam: ${nutrition.targetCalories - nutrition.calories} kcal`
                          : `Excesso: ${nutrition.calories - nutrition.targetCalories} kcal`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
