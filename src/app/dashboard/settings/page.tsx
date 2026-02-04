'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, Lock, Bell, Globe, Database, Shield } from "lucide-react"
import { toast } from "@/lib/hooks/use-toast"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    schoolName: 'Sekolah Menengah Atas XYZ',
    schoolEmail: 'admin@sekolah.id',
    schoolPhone: '+62 812 3456 7890',
    currency: 'IDR',
    timezone: 'Asia/Jakarta',
    language: 'id',
    sppAmount: 500000,
    dueDate: 10,
    theme: 'light',
    emailNotification: true,
    paymentReminder: true,
    monthlyReport: true,
    backupEnabled: true,
    backupFrequency: 'weekly',
  })

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulasi penyimpanan data
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Pengaturan Tersimpan",
        description: "Semua perubahan pengaturan telah disimpan dengan sukses.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tight text-balance">Pengaturan Sistem</h1>
        <p className="text-muted-foreground text-balance">
          Kelola konfigurasi sistem, sekolah, notifikasi, dan keamanan aplikasi
        </p>
      </div>

      {/* School Information Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b flex flex-row items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-950/50 rounded-lg">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Informasi Sekolah</CardTitle>
            <CardDescription className="mt-1">
              Data dasar institusi pendidikan Anda
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="text-sm font-semibold">
                Nama Sekolah
              </Label>
              <Input
                id="schoolName"
                value={settings.schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                placeholder="Masukkan nama sekolah"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolEmail" className="text-sm font-semibold">
                Email Sekolah
              </Label>
              <Input
                id="schoolEmail"
                type="email"
                value={settings.schoolEmail}
                onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                placeholder="admin@sekolah.id"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolPhone" className="text-sm font-semibold">
                Nomor Telepon
              </Label>
              <Input
                id="schoolPhone"
                value={settings.schoolPhone}
                onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
                placeholder="+62 812 3456 7890"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-sm font-semibold">
                Zona Waktu
              </Label>
              <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger id="timezone" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                  <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                  <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-semibold">
                Mata Uang
              </Label>
              <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger id="currency" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-semibold">
                Bahasa
              </Label>
              <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger id="language" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SPP Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b flex flex-row items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/50 rounded-lg">
            <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Konfigurasi SPP</CardTitle>
            <CardDescription className="mt-1">
              Atur nominal SPP dan tanggal jatuh tempo pembayaran
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sppAmount" className="text-sm font-semibold">
                Nominal SPP per Bulan (Rp)
              </Label>
              <Input
                id="sppAmount"
                type="number"
                value={settings.sppAmount}
                onChange={(e) => handleInputChange('sppAmount', Number(e.target.value))}
                placeholder="500000"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-semibold">
                Tanggal Jatuh Tempo (Tanggal)
              </Label>
              <Input
                id="dueDate"
                type="number"
                min="1"
                max="31"
                value={settings.dueDate}
                onChange={(e) => handleInputChange('dueDate', Number(e.target.value))}
                placeholder="10"
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                Pembayaran dianggap terlambat setelah tanggal ini
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b flex flex-row items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-lg">
            <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Notifikasi</CardTitle>
            <CardDescription className="mt-1">
              Kelola preferensi notifikasi sistem
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Notifikasi Email</p>
              <p className="text-xs text-muted-foreground">
                Terima notifikasi penting melalui email
              </p>
            </div>
            <Switch
              checked={settings.emailNotification}
              onCheckedChange={(value) => handleInputChange('emailNotification', value)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Pengingat Pembayaran</p>
              <p className="text-xs text-muted-foreground">
                Kirim pengingat ke siswa yang belum membayar SPP
              </p>
            </div>
            <Switch
              checked={settings.paymentReminder}
              onCheckedChange={(value) => handleInputChange('paymentReminder', value)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Laporan Bulanan</p>
              <p className="text-xs text-muted-foreground">
                Terima ringkasan laporan keuangan setiap bulan
              </p>
            </div>
            <Switch
              checked={settings.monthlyReport}
              onCheckedChange={(value) => handleInputChange('monthlyReport', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b flex flex-row items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-lg">
            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Backup & Keamanan</CardTitle>
            <CardDescription className="mt-1">
              Pengaturan backup otomatis dan keamanan data
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium text-sm">Backup Otomatis</p>
              <p className="text-xs text-muted-foreground">
                Aktifkan backup data secara otomatis
              </p>
            </div>
            <Switch
              checked={settings.backupEnabled}
              onCheckedChange={(value) => handleInputChange('backupEnabled', value)}
            />
          </div>
          {settings.backupEnabled && (
            <div className="space-y-2 pl-3 border-l-2 border-emerald-500">
              <Label htmlFor="backupFrequency" className="text-sm font-semibold">
                Frekuensi Backup
              </Label>
              <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                <SelectTrigger id="backupFrequency" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Setiap Hari</SelectItem>
                  <SelectItem value="weekly">Setiap Minggu</SelectItem>
                  <SelectItem value="monthly">Setiap Bulan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button variant="outline" className="w-full gap-2 mt-2">
            <Lock className="h-4 w-4" />
            Buat Backup Sekarang
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur -mx-4 md:-mx-8 px-4 md:px-8 py-4 border-t">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
        <Button variant="outline">
          Batal
        </Button>
      </div>
    </div>
  )
}
