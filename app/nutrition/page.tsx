"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Food {
  id: number
  name: string
  calories_per_100g: number
  carbs_per_100g: number
  protein_per_100g: number
  fat_per_100g: number
}

interface MealEntry {
  id: number
  food_name: string
  quantity: number
  calories: number
  carbs: number
  protein: number
  fat: number
  meal_type: string
  timestamp: string
}

export default function NutritionPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState("")
  const [mealType, setMealType] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
  })

  const targets = {
    calories: 2000,
    carbs: 250,
    protein: 150,
    fat: 67,
  }

  useEffect(() => {
    fetchFoods()
    fetchTodaysMeals()
  }, [])

  const fetchFoods = async () => {
    try {
      const response = await fetch("/api/foods")
      const data = await response.json()
      setFoods(data)
    } catch (error) {
      console.error("Error fetching foods:", error)
    }
  }

  const fetchTodaysMeals = async () => {
    try {
      const response = await fetch("/api/meals/today")
      const data = await response.json()
      setMealEntries(data)

      // Calculate daily totals
      const totals = data.reduce(
        (acc: any, entry: MealEntry) => ({
          calories: acc.calories + entry.calories,
          carbs: acc.carbs + entry.carbs,
          protein: acc.protein + entry.protein,
          fat: acc.fat + entry.fat,
        }),
        { calories: 0, carbs: 0, protein: 0, fat: 0 },
      )

      setDailyTotals(totals)
    } catch (error) {
      console.error("Error fetching meals:", error)
    }
  }

  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddMeal = async () => {
    if (!selectedFood || !quantity || !mealType) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
      return
    }

    const quantityNum = Number.parseFloat(quantity)
    const multiplier = quantityNum / 100

    const mealData = {
      food_id: selectedFood.id,
      food_name: selectedFood.name,
      quantity: quantityNum,
      calories: Math.round(selectedFood.calories_per_100g * multiplier),
      carbs: Math.round(selectedFood.carbs_per_100g * multiplier * 10) / 10,
      protein: Math.round(selectedFood.protein_per_100g * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat_per_100g * multiplier * 10) / 10,
      meal_type: mealType,
      timestamp: new Date().toISOString(),
    }

    setLoading(true)
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Alimento adicionado à refeição!",
        })
        setSelectedFood(null)
        setQuantity("")
        setMealType("")
        setSearchTerm("")
        fetchTodaysMeals()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar alimento.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteMealEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Item removido da refeição!",
        })
        fetchTodaysMeals()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover item.",
        variant: "destructive",
      })
    }
  }

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: "Café da manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Controle Nutricional</h1>
            <p className="text-gray-600">Registre suas refeições e monitore seus macros</p>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Calorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyTotals.calories}</div>
              <Progress value={(dailyTotals.calories / targets.calories) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: {targets.calories} kcal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Carboidratos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyTotals.carbs}g</div>
              <Progress value={(dailyTotals.carbs / targets.carbs) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: {targets.carbs}g</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Proteínas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyTotals.protein}g</div>
              <Progress value={(dailyTotals.protein / targets.protein) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: {targets.protein}g</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gorduras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyTotals.fat}g</div>
              <Progress value={(dailyTotals.fat / targets.fat) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Meta: {targets.fat}g</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Food Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Adicionar Alimento
              </CardTitle>
              <CardDescription>Busque e adicione alimentos às suas refeições</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Buscar Alimento</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Ex: arroz, frango, maçã..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {searchTerm && (
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {filteredFoods.map((food) => (
                    <div
                      key={food.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                        selectedFood?.id === food.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">{food.calories_per_100g} kcal/100g</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFood && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium">{selectedFood.name}</h4>
                  <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2 mt-1">
                    <span>Calorias: {selectedFood.calories_per_100g}/100g</span>
                    <span>Carbs: {selectedFood.carbs_per_100g}g/100g</span>
                    <span>Proteína: {selectedFood.protein_per_100g}g/100g</span>
                    <span>Gordura: {selectedFood.fat_per_100g}g/100g</span>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="quantity">Quantidade (gramas)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Ex: 150"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="meal-type">Tipo de Refeição</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a refeição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Café da manhã</SelectItem>
                    <SelectItem value="lunch">Almoço</SelectItem>
                    <SelectItem value="dinner">Jantar</SelectItem>
                    <SelectItem value="snack">Lanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddMeal} className="w-full" disabled={loading}>
                {loading ? "Adicionando..." : "Adicionar à Refeição"}
              </Button>
            </CardContent>
          </Card>

          {/* Today's Meals */}
          <Card>
            <CardHeader>
              <CardTitle>Refeições de Hoje</CardTitle>
              <CardDescription>Alimentos consumidos hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mealEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{entry.food_name}</span>
                        <Badge variant="outline">{getMealTypeLabel(entry.meal_type)}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.quantity}g • {entry.calories} kcal
                      </div>
                      <div className="text-xs text-muted-foreground">
                        C: {entry.carbs}g • P: {entry.protein}g • G: {entry.fat}g
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMealEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {mealEntries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma refeição registrada hoje.</p>
                    <p className="text-sm">Comece adicionando alimentos às suas refeições.</p>
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
