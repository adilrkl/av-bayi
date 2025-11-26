"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface OrderStatusUpdateProps {
    orderId: string
    currentStatus: string
}

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onStatusChange(value: string) {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: value }),
            })

            if (!response.ok) {
                throw new Error("Failed to update status")
            }

            toast.success("Order status updated")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Select onValueChange={onStatusChange} defaultValue={currentStatus} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="PENDING">Beklemede</SelectItem>
                <SelectItem value="PROCESSING">İşleme Alındı</SelectItem>
                <SelectItem value="SHIPPED">Kargoya Verildi</SelectItem>
                <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
            </SelectContent>
        </Select>
    )
}
