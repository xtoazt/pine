"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Settings, Palette, Layout, Eye, Shield } from 'lucide-react'
import { useSettings } from '@/contexts/settings-context'

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useSettings()

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Customize your pine experience with iOS-style settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of pine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex space-x-2">
                {['blue', 'green', 'purple', 'red', 'orange', 'pink'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSetting('accentColor', color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      settings.accentColor === color ? 'border-primary' : 'border-muted'
                    }`}
                    style={{ backgroundColor: color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'purple' ? '#8b5cf6' : color === 'red' ? '#ef4444' : color === 'orange' ? '#f97316' : '#ec4899' }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font Size: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting('fontSize', value[0])}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Bold Text</Label>
              <Switch
                checked={settings.boldText}
                onCheckedChange={(value) => updateSetting('boldText', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Layout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layout className="mr-2 h-5 w-5" />
              Layout
            </CardTitle>
            <CardDescription>
              Customize how games are displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Layout Style</Label>
              <Select value={settings.layout} onValueChange={(value) => updateSetting('layout', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Games Per Row: {settings.gamesPerRow}</Label>
              <Slider
                value={[settings.gamesPerRow]}
                onValueChange={(value) => updateSetting('gamesPerRow', value[0])}
                min={2}
                max={6}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Game Counts</Label>
              <Switch
                checked={settings.showGameCounts}
                onCheckedChange={(value) => updateSetting('showGameCounts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Compact Mode</Label>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(value) => updateSetting('compactMode', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Display
            </CardTitle>
            <CardDescription>
              Control what information is shown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Show Thumbnails</Label>
              <Switch
                checked={settings.showThumbnails}
                onCheckedChange={(value) => updateSetting('showThumbnails', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Descriptions</Label>
              <Switch
                checked={settings.showDescriptions}
                onCheckedChange={(value) => updateSetting('showDescriptions', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Tags</Label>
              <Switch
                checked={settings.showTags}
                onCheckedChange={(value) => updateSetting('showTags', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Stats</Label>
              <Switch
                checked={settings.showStats}
                onCheckedChange={(value) => updateSetting('showStats', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label>Enable Cloaking</Label>
              <Switch
                checked={settings.enableCloaking}
                onCheckedChange={(value) => updateSetting('enableCloaking', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Remember Preferences</Label>
              <Switch
                checked={settings.rememberPreferences}
                onCheckedChange={(value) => updateSetting('rememberPreferences', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Analytics</Label>
              <Switch
                checked={settings.analytics}
                onCheckedChange={(value) => updateSetting('analytics', value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Reset or export your settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Defaults
            </Button>
            <Button variant="outline">
              Export Settings
            </Button>
            <Button variant="outline">
              Import Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
