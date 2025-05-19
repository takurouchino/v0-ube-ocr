"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { InspectionData } from "@/types/inspection-data"
import { fetchInspectionDataList } from "@/lib/data-service"

export function DataManagement() {
  const [inspectionDataList, setInspectionDataList] = useState<InspectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInspectionDataList()
        setInspectionDataList(data)
      } catch (error) {
        console.error("データ取得中にエラーが発生しました:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>データを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">データ管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>検査成績表一覧</CardTitle>
          <CardDescription>保存された検査成績表データの一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          {inspectionDataList.length === 0 ? (
            <p className="text-center py-8 text-gray-500">保存されたデータがありません</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {inspectionDataList.map((data, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="grid grid-cols-3 w-full px-4">
                    <span>{data.companyName}</span>
                    <span>{data.partName}</span>
                    <span>{new Date(data.createdAt).toLocaleDateString()}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 py-2">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">会社名</p>
                          <p>{data.companyName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">図版</p>
                          <p>{data.drawingNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">品番</p>
                          <p>{data.partNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">品名</p>
                          <p>{data.partName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">担当者</p>
                          <p>{data.inspector}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">コメント</p>
                          <p>{data.comment}</p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">対象</TableHead>
                              <TableHead className="w-[80px]">記号</TableHead>
                              <TableHead className="w-[80px]">寸法値</TableHead>
                              <TableHead className="w-[80px]">公差下限</TableHead>
                              <TableHead className="w-[80px]">公差上限</TableHead>
                              <TableHead className="w-[100px]">最小許容寸法</TableHead>
                              <TableHead className="w-[60px]">個数</TableHead>
                              <TableHead className="w-[80px]">実測1回目</TableHead>
                              <TableHead className="w-[80px]">実測2回目</TableHead>
                              <TableHead className="w-[80px]">全体判定</TableHead>
                              <TableHead className="w-[80px]">1回目判定</TableHead>
                              <TableHead className="w-[80px]">2回目判定</TableHead>
                              <TableHead className="w-[120px]">備考</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.inspectionItems.map((item, itemIndex) => (
                              <TableRow key={itemIndex}>
                                <TableCell>{item.target}</TableCell>
                                <TableCell>{item.symbol}</TableCell>
                                <TableCell>{item.dimension}</TableCell>
                                <TableCell>{item.lowerTolerance}</TableCell>
                                <TableCell>{item.upperTolerance}</TableCell>
                                <TableCell>{item.minAllowableDimension}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.measurement1}</TableCell>
                                <TableCell>{item.measurement2}</TableCell>
                                <TableCell>{item.overallJudgment}</TableCell>
                                <TableCell>{item.judgment1}</TableCell>
                                <TableCell>{item.judgment2}</TableCell>
                                <TableCell>{item.remarks}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
