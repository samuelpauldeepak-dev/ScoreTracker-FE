"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface ImportTestsDialogProps {
  onClose: () => void
}

interface ParsedTest {
  name: string
  subject: string
  category: "mock" | "practice" | "sectional" | "full"
  score: number
  totalMarks: number
  percentage: number
  date: string
  duration?: number
  topics?: string[]
  isValid: boolean
  errors: string[]
}

export function ImportTestsDialog({ onClose }: ImportTestsDialogProps) {
  const { addTest } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [parsedTests, setParsedTests] = useState<ParsedTest[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  const validateTest = (test: any): ParsedTest => {
    const errors: string[] = []

    if (!test.name || typeof test.name !== "string") {
      errors.push("Test name is required")
    }

    if (!test.subject || typeof test.subject !== "string") {
      errors.push("Subject is required")
    }

    if (!["mock", "practice", "sectional", "full"].includes(test.category)) {
      errors.push("Category must be one of: mock, practice, sectional, full")
    }

    const score = Number(test.score)
    const totalMarks = Number(test.totalMarks)

    if (isNaN(score) || score < 0) {
      errors.push("Score must be a valid positive number")
    }

    if (isNaN(totalMarks) || totalMarks <= 0) {
      errors.push("Total marks must be a valid positive number")
    }

    if (!test.date || isNaN(new Date(test.date).getTime())) {
      errors.push("Date must be a valid date")
    }

    const percentage =
      !isNaN(score) && !isNaN(totalMarks) && totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0

    return {
      name: test.name || "",
      subject: test.subject || "",
      category: test.category || "practice",
      score: score || 0,
      totalMarks: totalMarks || 0,
      percentage,
      date: test.date || new Date().toISOString().split("T")[0],
      duration: test.duration ? Number(test.duration) : undefined,
      topics: test.topics ? test.topics.split(",").map((t: string) => t.trim()) : undefined,
      isValid: errors.length === 0,
      errors,
    }
  }

  const parseCSV = (csvText: string): ParsedTest[] => {
    const lines = csvText.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const tests: ParsedTest[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const testData: any = {}

      headers.forEach((header, index) => {
        const value = values[index] || ""

        // Map common header variations
        switch (header) {
          case "test name":
          case "name":
          case "test":
            testData.name = value
            break
          case "subject":
            testData.subject = value
            break
          case "category":
          case "type":
            testData.category = value.toLowerCase()
            break
          case "score":
          case "marks obtained":
          case "obtained":
            testData.score = value
            break
          case "total marks":
          case "total":
          case "maximum marks":
            testData.totalMarks = value
            break
          case "date":
          case "test date":
            testData.date = value
            break
          case "duration":
          case "time":
            testData.duration = value
            break
          case "topics":
          case "syllabus":
            testData.topics = value
            break
        }
      })

      tests.push(validateTest(testData))
    }

    return tests
  }

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        try {
          const parsed = parseCSV(text)
          setParsedTests(parsed)
          setShowPreview(true)
        } catch (error) {
          toast({
            title: "Parse Error",
            description: "Failed to parse the CSV file. Please check the format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    },
    [toast],
  )

  const handleImport = async () => {
    const validTests = parsedTests.filter((test) => test.isValid)
    if (validTests.length === 0) {
      toast({
        title: "No Valid Tests",
        description: "Please fix the errors before importing.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setImportProgress(0)

    try {
      for (let i = 0; i < validTests.length; i++) {
        const test = validTests[i]
        addTest({
          name: test.name,
          subject: test.subject,
          category: test.category,
          score: test.score,
          totalMarks: test.totalMarks,
          percentage: test.percentage,
          date: test.date,
          duration: test.duration,
          topics: test.topics,
        })

        setImportProgress(((i + 1) / validTests.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay for UX
      }

      toast({
        title: "Import Successful",
        description: `Successfully imported ${validTests.length} test${validTests.length !== 1 ? "s" : ""}.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "An error occurred during import. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `name,subject,category,score,total marks,date,duration,topics
NEET Mock Test 1,Physics,mock,85,100,2024-01-20,180,"Mechanics, Thermodynamics"
JEE Practice Set,Mathematics,practice,72,100,2024-01-18,120,"Calculus, Algebra"
Chemistry Full Test,Chemistry,full,88,100,2024-01-15,180,"Organic Chemistry, Inorganic Chemistry"`

    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "test-import-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (showPreview) {
    const validTests = parsedTests.filter((test) => test.isValid)
    const invalidTests = parsedTests.filter((test) => !test.isValid)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Import Preview</h3>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
            Back
          </Button>
        </div>

        {invalidTests.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {invalidTests.length} test{invalidTests.length !== 1 ? "s have" : " has"} validation errors and will be
              skipped.
            </AlertDescription>
          </Alert>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2">
          {parsedTests.map((test, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                test.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {test.subject} • {test.category} • {test.score}/{test.totalMarks} ({test.percentage}%)
                  </p>
                </div>
                {test.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              {!test.isValid && (
                <div className="mt-2">
                  {test.errors.map((error, errorIndex) => (
                    <p key={errorIndex} className="text-xs text-red-600">
                      • {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Importing tests...</span>
              <span>{Math.round(importProgress)}%</span>
            </div>
            <Progress value={importProgress} />
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleImport} disabled={isLoading || validTests.length === 0} className="flex-1">
            {isLoading ? "Importing..." : `Import ${validTests.length} Test${validTests.length !== 1 ? "s" : ""}`}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
          <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Import Test Results</h3>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with your test results to import them in bulk
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Choose CSV File</Label>
          <div className="flex items-center gap-2">
            <Input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload} className="flex-1" />
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Upload className="h-4 w-4 mr-2" />
              Template
            </Button>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>CSV Format:</strong> Your file should include columns for name, subject, category, score, total
            marks, and date. Download the template above for the correct format.
          </AlertDescription>
        </Alert>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Required columns:</strong> name, subject, category, score, total marks, date
          </p>
          <p>
            <strong>Optional columns:</strong> duration, topics
          </p>
          <p>
            <strong>Categories:</strong> mock, practice, sectional, full
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
