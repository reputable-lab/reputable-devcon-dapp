import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type ModelWeights = {
  commitWeight: string
  nbOfContributorWeight: string
  contributionRecencyWeight: string
  txWeight: string
  uniqueFromWeight: string
  tveWeight: string
}

type OneModelCardProps = {
  modelName: string
  owner: string
  modelWeights: ModelWeights
  blockTimestamp: string
}

export function OneModelCard({
  modelName,
  owner,
  modelWeights,
  blockTimestamp,
}: OneModelCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const date = new Date(parseInt(blockTimestamp) * 1000).toLocaleDateString()

  const chartData = [
    { subject: 'Commits', value: parseInt(modelWeights.commitWeight) },
    { subject: 'Contributors', value: parseInt(modelWeights.nbOfContributorWeight) },
    { subject: 'Recency', value: parseInt(modelWeights.contributionRecencyWeight) },
    { subject: 'Transactions', value: parseInt(modelWeights.txWeight) },
    { subject: 'Unique From', value: parseInt(modelWeights.uniqueFromWeight) },
    { subject: 'TVE', value: parseInt(modelWeights.tveWeight) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{modelName}</CardTitle>
        <CardDescription>
          Created by: {owner.slice(0, 6)}...{owner.slice(-4)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs">Created on: {date}</p>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to={'/compute'}>Compute</Link>
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Visualize model</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-center">{modelName} Weights Visualization</DialogTitle>
              </DialogHeader>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Model Weights"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
