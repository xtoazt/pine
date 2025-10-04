"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Settings, X, Palette, Layout, Eye } from 'lucide-react'
import { useSettings } from '@/contexts/settings-context'
import Link from 'next/link'

export function FloatingSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSetting } = useSettings()

  const quickSettings = [
    {
      id: 'theme',
      label: 'Dark Mode',
      icon: Palette,
      type: 'switch',
      value: settings.theme === 'dark',
      onChange: (checked: boolean) => updateSetting('theme', checked ? 'dark' : 'light')
    },
    {
      id: 'compact',
      label: 'Compact Mode',
      icon: Layout,
      type: 'switch',
      value: settings.compactMode,
      onChange: (checked: boolean) => updateSetting('compactMode', checked)
    },
    {
      id: 'thumbnails',
      label: 'Show Thumbnails',
      icon: Eye,
      type: 'switch',
      value: settings.showThumbnails,
      onChange: (checked: boolean) => updateSetting('showThumbnails', checked)
    }
  ]

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card className="w-80 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Quick Settings</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">{setting.label}</Label>
                  </div>
                  {setting.type === 'switch' && (
                    <Switch
                      checked={setting.value}
                      onCheckedChange={setting.onChange}
                    />
                  )}
                </div>
              ))}
              
              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    All Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
