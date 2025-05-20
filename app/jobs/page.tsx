import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllJobs } from "@/lib/jobs"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, Briefcase, Building, Calendar, MapPin, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Вакансии - DavisState",
  description: "Актуальные вакансии в государственных учреждениях DavisState",
}

export default async function JobsPage() {
  const jobs = await getAllJobs()

  // Group jobs by department
  const jobsByDepartment: Record<string, typeof jobs> = {}

  jobs.forEach((job) => {
    if (!jobsByDepartment[job.department]) {
      jobsByDepartment[job.department] = []
    }

    jobsByDepartment[job.department].push(job)
  })

  const departments = Object.keys(jobsByDepartment)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Вакансии</h1>
          <p className="text-muted-foreground">Актуальные вакансии в государственных учреждениях DavisState</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск вакансий..." className="w-full md:w-[300px] pl-8" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 flex flex-wrap h-auto">
          <TabsTrigger value="all">Все вакансии</TabsTrigger>
          {departments.map((department) => (
            <TabsTrigger key={department} value={department}>
              {department}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Building className="h-4 w-4 mr-1" />
                        {job.department}
                      </CardDescription>
                    </div>
                    <div className="text-lg font-medium">{job.salary} ₽</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      До {formatDate(job.deadline)}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{job.description}</p>

                  <div>
                    <h4 className="font-medium mb-2">Требования:</h4>
                    <p className="text-muted-foreground">{job.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {departments.map((department) => (
          <TabsContent key={department} value={department}>
            <div className="grid grid-cols-1 gap-6">
              {jobsByDepartment[department].map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <Building className="h-4 w-4 mr-1" />
                          {job.department}
                        </CardDescription>
                      </div>
                      <div className="text-lg font-medium">{job.salary} ₽</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        До {formatDate(job.deadline)}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{job.description}</p>

                    <div>
                      <h4 className="font-medium mb-2">Требования:</h4>
                      <p className="text-muted-foreground">{job.requirements}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
