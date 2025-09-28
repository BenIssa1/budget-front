"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconPhone, IconClock, IconCurrencyDollar, IconTrendingUp, IconCalendar, IconFilter, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconDownload } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { getMonthlyConsumptionByExtension, exportMonthlyConsumptionCSV } from "@/services/extension-consumption"

type ViewMode = "all" | "top"

export function ExtensionConsumptionTable() {
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const itemsPerPage = 10

  const { data, isLoading, error } = useQuery({
    queryKey: ['extension-consumption', year, month],
    queryFn: () => getMonthlyConsumptionByExtension(year, month),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [viewMode, searchTerm, year, month])

  // Export CSV function
  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const blob = await exportMonthlyConsumptionCSV(year, month)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with date
      const monthName = new Date(2024, month - 1).toLocaleDateString('fr-FR', { month: 'long' })
      link.download = `consommation-extensions-${monthName.toLowerCase()}-${year}.csv`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      // You could add a toast notification here
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPhone className="size-5" />
            Consommation des Extensions
          </CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPhone className="size-5" />
            Consommation des Extensions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            Erreur lors du chargement des données
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentData = viewMode === "all" ? data.data : data.topConsumption
  const filteredData = currentData.filter(extension =>
    extension.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    extension.extensionNumber.includes(searchTerm)
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconPhone className="size-5" />
              <CardTitle>Consommation des Extensions</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar className="size-4" />
                {data.period.month}/{data.period.year}
              </div>
              <Button
                onClick={handleExportCSV}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <IconDownload className="size-4" />
                {isExporting ? "Export..." : "Exporter CSV"}
              </Button>
            </div>
          </div>
          
          <CardDescription>
            Période: {new Date(data.period.startDate).toLocaleDateString('fr-FR')} - {new Date(data.period.endDate).toLocaleDateString('fr-FR')}
          </CardDescription>

          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="year-filter">Année:</Label>
              <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                <SelectTrigger className="w-24" id="year-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="month-filter">Mois:</Label>
              <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
                <SelectTrigger className="w-32" id="month-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <SelectItem key={m} value={m.toString()}>
                      {new Date(2024, m - 1).toLocaleDateString('fr-FR', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <IconFilter className="size-4" />
              <Input
                placeholder="Rechercher une extension..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {/* Boutons de basculement */}
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
            <ToggleGroupItem value="all" className="flex items-center gap-2">
              <IconPhone className="size-4" />
              Liste des Extensions ({data.data.length})
            </ToggleGroupItem>
            <ToggleGroupItem value="top" className="flex items-center gap-2">
              <IconTrendingUp className="size-4" />
              Meilleurs Consommateurs ({data.topConsumption.length})
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent>
        {/* Statistiques du mois */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IconCalendar className="size-5" />
            Statistiques du mois de {new Date(2024, data.period.month - 1).toLocaleDateString('fr-FR', { month: 'long' })} {data.period.year}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.summary.totalExtensions}</div>
              <div className="text-sm text-muted-foreground mt-1">Extensions Total</div>
              <div className="text-xs text-muted-foreground mt-1">Extensions configurées</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{data.summary.totalCalls}</div>
              <div className="text-sm text-muted-foreground mt-1">Appels Total</div>
              <div className="text-xs text-muted-foreground mt-1">Appels effectués</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatDuration(data.summary.totalDuration)}</div>
              <div className="text-sm text-muted-foreground mt-1">Durée Total</div>
              <div className="text-xs text-muted-foreground mt-1">Temps de communication</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(data.summary.totalCost)}</div>
              <div className="text-sm text-muted-foreground mt-1">Coût Total</div>
              <div className="text-xs text-muted-foreground mt-1">Dépenses du mois</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(data.summary.averageCostPerExtension)}</div>
              <div className="text-sm text-muted-foreground mt-1">Coût Moyen</div>
              <div className="text-xs text-muted-foreground mt-1">Par extension</div>
            </div>
          </div>
          
          {/* Informations supplémentaires */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Période d'analyse</div>
              <div className="text-sm">
                {new Date(data.period.startDate).toLocaleDateString('fr-FR')} - {new Date(data.period.endDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Extensions actives</div>
              <div className="text-sm">
                {data.data.filter(ext => ext.cost > 0).length} sur {data.summary.totalExtensions} extensions
              </div>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Taux d'utilisation</div>
              <div className="text-sm">
                {data.summary.totalExtensions > 0 ? Math.round((data.data.filter(ext => ext.cost > 0).length / data.summary.totalExtensions) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Extension</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="text-center">Appels</TableHead>
                <TableHead className="text-center">Durée</TableHead>
                <TableHead className="text-right">Coût</TableHead>
                <TableHead className="text-right">Solde</TableHead>
                <TableHead className="text-center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((extension) => (
                  <TableRow key={extension.extensionId}>
                    <TableCell className="font-medium">
                      {extension.extensionNumber}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {extension.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {extension.calls}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <IconClock className="size-4 text-muted-foreground" />
                        {formatDuration(extension.durationMinutes)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center gap-1 justify-end">
                        <IconCurrencyDollar className="size-4 text-muted-foreground" />
                        {formatCurrency(extension.cost)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(extension.balance)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={extension.cost > 0 ? "default" : "secondary"}
                        className={extension.cost > 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                      >
                        {extension.cost > 0 ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune extension trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Affichage de {startIndex + 1} à {Math.min(endIndex, filteredData.length)} sur {filteredData.length} extension(s)
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex"
              >
                <IconChevronsLeft className="size-4" />
                <span className="sr-only">Première page</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IconChevronLeft className="size-4" />
                <span className="sr-only">Page précédente</span>
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <IconChevronRight className="size-4" />
                <span className="sr-only">Page suivante</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex"
              >
                <IconChevronsRight className="size-4" />
                <span className="sr-only">Dernière page</span>
              </Button>
            </div>
          </div>
        )}

        {/* Summary info */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div>
            {totalPages > 1 ? (
              <>Page {currentPage} sur {totalPages}</>
            ) : (
              <>Affichage de {filteredData.length} extension(s) sur {currentData.length}</>
            )}
          </div>
          <div>
            Coût moyen par extension: {formatCurrency(data.summary.averageCostPerExtension)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
