"use client"

import { IconTrendingDown, IconTrendingUp, IconUsers, IconPlug, IconSettings, IconWallet, IconPhone, IconCreditCard, IconGift, IconSettings2 } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getGeneralStatistics } from "@/services/statistics"

export function SectionCards() {
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['statistics', 'general'],
    queryFn: getGeneralStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription className="h-4 bg-gray-200 rounded animate-pulse"></CardDescription>
              <CardTitle className="h-8 bg-gray-200 rounded animate-pulse"></CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="text-center text-red-500">
          Erreur lors du chargement des statistiques
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="px-4 lg:px-6">
        <div className="text-center text-gray-500">
          Aucune donnée disponible
        </div>
      </div>
    )
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Utilisateurs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.totalUsers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4" />
              Utilisateurs
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Utilisateurs enregistrés <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Nombre total d'utilisateurs du système
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Extensions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.totalExtensions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconPlug className="size-4" />
              Extensions
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Extensions configurées <IconPlug className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Nombre total d'extensions actives
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Services</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.totalServices.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconSettings className="size-4" />
              Services
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Services disponibles <IconSettings className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Nombre total de services configurés
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Budgets</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.totalBudgets.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconWallet className="size-4" />
              Budgets
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Budgets créés <IconWallet className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Nombre total de budgets configurés
          </div>
        </CardFooter>
      </Card>

      

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Numeros Payants</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.totalPaidPricing.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCreditCard className="size-4" />
              Payants
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Numero payants <IconCreditCard className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Nombre de plans payants configurés
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Numeros Gratuits</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.totalFreePricing.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconGift className="size-4" />
              Gratuits
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Numero gratuits <IconGift className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Nombre de plans gratuits configurés
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Configurations Actives</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.activeConfigurations.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconSettings2 className="size-4" />
              Actives
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Configurations actives <IconSettings2 className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Nombre de configurations actives
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
