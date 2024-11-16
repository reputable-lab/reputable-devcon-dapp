import { useQuery } from '@tanstack/react-query'
import { request } from 'graphql-request'
import { ArrowDownFromLine, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OneModelCard } from '@/components/OneModelCard.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { GET_REPUTABLE_MODELS, SUBGRAPH_URL } from '@/externals/graphQLRequest'
import { GetReputableModelsGraphQLResponse } from '@/utils/types'

function Landing() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const pageSize = 9

  const { isLoading, error, data } = useQuery({
    queryKey: ['reputableModels', currentPage, sortOrder],
    queryFn: async () => {
      const { reputableModels, reputableModelsCount } =
        await request<GetReputableModelsGraphQLResponse>(SUBGRAPH_URL, GET_REPUTABLE_MODELS, {
          first: pageSize,
          skip: (currentPage - 1) * pageSize,
          orderBy: 'blockTimestamp',
          orderDirection: sortOrder,
        })
      return { reputableModels, totalCount: reputableModelsCount.length }
    },
  })

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize)

  return (
    <>
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="text-4xl">Reputation Models Library</h1>
          <h2 className="mt-1">Explore reputation models designed for various ecosystems</h2>
        </div>
        <div className="flex items-center gap-x-2">
          <Button size="lg" asChild>
            <Link to={'/build'}>
              <ArrowDownFromLine className="mr-2" />
              <span>Build Reputation Model</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to={'/chat'}>
              <MessageCircle className="mr-2" />
              <span>Open Chat</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-x-4">
        <div className="rounded-md border p-4">
          <div className="text-lg">Reputation Model Added</div>
          <div className="mt-2 text-center text-4xl font-bold">
            {isLoading ? <Skeleton className="mx-auto h-10 w-20" /> : data?.totalCount || 0}
          </div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-lg">Unique Attestors</div>
          <div className="mt-2 text-center text-4xl font-bold">
            <Skeleton className="mx-auto h-10 w-20" />
          </div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-lg">Attestations Minted</div>
          <div className="mt-2 text-center text-4xl font-bold">
            <Skeleton className="mx-auto h-10 w-20" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Sort by:</span>
            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {isLoading ? (
            Array(9)
              .fill(0)
              .map((_, index) => <Skeleton key={index} className="h-[200px] w-full" />)
          ) : error ? (
            <div className="col-span-3 text-center text-red-400">Error: {error.message}</div>
          ) : (
            data?.reputableModels.map((model) => (
              <OneModelCard
                key={model.id}
                modelName={model.modelName}
                owner={model.owner}
                modelWeights={model.modelWeights}
                blockTimestamp={model.blockTimestamp}
              />
            ))
          )}
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft size="18" />
          </Button>
          <span className="flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight size="18" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default Landing
