import { SliderForm } from "@/components/admin/slider-form"

export default function NewSliderPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Yeni Slayt Ekle</h1>
            <SliderForm />
        </div>
    )
}
