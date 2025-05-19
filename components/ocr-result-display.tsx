"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { InspectionData, InspectionItem } from "@/types/inspection-data"
import { saveInspectionData } from "@/lib/data-service"
import { useToast } from "@/hooks/use-toast"

interface OcrResultDisplayProps {
  data: InspectionData | null
}

export function OcrResultDisplay({ data }: OcrResultDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<InspectionData | null>(data)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // データが変更されたら編集データも更新
  if (data !== null && JSON.stringify(data) !== JSON.stringify(editedData)) {
    setEditedData(data)
  }

  const handleInputChange = (field: keyof Omit<InspectionData, "inspectionItems">, value: string) => {
    if (!editedData) return
    setEditedData({
      ...editedData,
      [field]: value,
    })
  }

  const handleItemChange = (index: number, field: keyof InspectionItem, value: string) => {
    if (!editedData) return
    const updatedItems = [...editedData.inspectionItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }
    setEditedData({
      ...editedData,
      inspectionItems: updatedItems,
    })
  }

  const handleSave = async () => {
    if (!editedData) return

    setIsSaving(true)
    try {
      await saveInspectionData(editedData)
      toast({
        title: "保存完了",
        description: "データが正常に保存されました。",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("データ保存中にエラーが発生しました:", error)
      toast({
        title: "エラー",
        description: "データの保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!data && !editedData) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        画像をアップロードして「読み取り開始」ボタンを押してください
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="text-md font-medium mb-4">概要情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">会社名</Label>
                <Input
                  id="companyName"
                  value={editedData?.companyName || ""}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drawingNumber">図版</Label>
                <Input
                  id="drawingNumber"
                  value={editedData?.drawingNumber || ""}
                  onChange={(e) => handleInputChange("drawingNumber", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partNumber">品番</Label>
                <Input
                  id="partNumber"
                  value={editedData?.partNumber || ""}
                  onChange={(e) => handleInputChange("partNumber", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partName">品名</Label>
                <Input
                  id="partName"
                  value={editedData?.partName || ""}
                  onChange={(e) => handleInputChange("partName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspector">担当者</Label>
                <Input
                  id="inspector"
                  value={editedData?.inspector || ""}
                  onChange={(e) => handleInputChange("inspector", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">コメント</Label>
                <Textarea
                  id="comment"
                  value={editedData?.comment || ""}
                  onChange={(e) => handleInputChange("comment", e.target.value)}
                  disabled={!isEditing}
                  className="h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-md font-medium mb-4">検査管理項目</h3>
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
                  {editedData?.inspectionItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.target || ""}
                          onChange={(e) => handleItemChange(index, "target", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.symbol || ""}
                          onChange={(e) => handleItemChange(index, "symbol", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.dimension || ""}
                          onChange={(e) => handleItemChange(index, "dimension", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.lowerTolerance || ""}
                          onChange={(e) => handleItemChange(index, "lowerTolerance", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.upperTolerance || ""}
                          onChange={(e) => handleItemChange(index, "upperTolerance", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.minAllowableDimension || ""}
                          onChange={(e) => handleItemChange(index, "minAllowableDimension", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[80px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.quantity || ""}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[50px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.measurement1 || ""}
                          onChange={(e) => handleItemChange(index, "measurement1", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.measurement2 || ""}
                          onChange={(e) => handleItemChange(index, "measurement2", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.overallJudgment || ""}
                          onChange={(e) => handleItemChange(index, "overallJudgment", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.judgment1 || ""}
                          onChange={(e) => handleItemChange(index, "judgment1", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.judgment2 || ""}
                          onChange={(e) => handleItemChange(index, "judgment2", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[60px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.remarks || ""}
                          onChange={(e) => handleItemChange(index, "remarks", e.target.value)}
                          disabled={!isEditing}
                          className="h-8 min-w-[100px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>編集</Button>
            <Button onClick={handleSave} disabled={isSaving || !editedData}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
