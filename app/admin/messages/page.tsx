"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Loader2, Mail } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch("/api/contact")
                const data = await res.json()
                if (data.success) {
                    setMessages(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch messages", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMessages()
    }, [])

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">İletişim Mesajları</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Gelen Kutusu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {messages.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead>Gönderen</TableHead>
                                    <TableHead>E-posta</TableHead>
                                    <TableHead>Konu</TableHead>
                                    <TableHead>Mesaj</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((message) => (
                                    <TableRow key={message.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(message.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                                        </TableCell>
                                        <TableCell className="font-medium">{message.name}</TableCell>
                                        <TableCell>{message.email}</TableCell>
                                        <TableCell>{message.subject}</TableCell>
                                        <TableCell className="max-w-md truncate" title={message.message}>
                                            {message.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Henüz mesaj bulunmuyor.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
