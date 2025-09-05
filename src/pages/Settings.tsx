import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Shield, CreditCard, Globe, Smartphone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en",
    avatar: "/placeholder.svg"
  });

  const [notifications, setNotifications] = useState({
    emailBidding: true,
    emailOutbid: true,
    emailAuctionEnd: true,
    emailNewListings: false,
    pushBidding: true,
    pushOutbid: true,
    pushAuctionEnd: true,
    smsHighValue: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showBiddingHistory: false,
    allowMessages: true,
    twoFactorAuth: false
  });

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleNotificationUpdate = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handlePrivacyUpdate = () => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="mb-2">Change Avatar</Button>
                  <p className="text-sm text-muted-foreground">Upload a new profile picture</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                      <SelectItem value="Europe/Paris">CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleProfileUpdate} className="btn-hero">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified about auction activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bidding Activity</p>
                      <p className="text-sm text-muted-foreground">When someone bids on your auctions</p>
                    </div>
                    <Switch
                      checked={notifications.emailBidding}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailBidding: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Outbid Alerts</p>
                      <p className="text-sm text-muted-foreground">When you've been outbid on an auction</p>
                    </div>
                    <Switch
                      checked={notifications.emailOutbid}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailOutbid: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auction Endings</p>
                      <p className="text-sm text-muted-foreground">When auctions you're watching are ending</p>
                    </div>
                    <Switch
                      checked={notifications.emailAuctionEnd}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailAuctionEnd: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Listings</p>
                      <p className="text-sm text-muted-foreground">Weekly digest of new auctions in your interests</p>
                    </div>
                    <Switch
                      checked={notifications.emailNewListings}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNewListings: checked }))}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Push Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bidding Activity</p>
                      <p className="text-sm text-muted-foreground">Instant notifications for bids</p>
                    </div>
                    <Switch
                      checked={notifications.pushBidding}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushBidding: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Outbid Alerts</p>
                      <p className="text-sm text-muted-foreground">Instant outbid notifications</p>
                    </div>
                    <Switch
                      checked={notifications.pushOutbid}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushOutbid: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auction Endings</p>
                      <p className="text-sm text-muted-foreground">Last-minute auction alerts</p>
                    </div>
                    <Switch
                      checked={notifications.pushAuctionEnd}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushAuctionEnd: checked }))}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleNotificationUpdate} className="btn-hero">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy settings and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Bidding History</p>
                    <p className="text-sm text-muted-foreground">Allow others to see your past bids</p>
                  </div>
                  <Switch
                    checked={privacy.showBiddingHistory}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showBiddingHistory: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Messages</p>
                    <p className="text-sm text-muted-foreground">Let other users send you direct messages</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowMessages: checked }))}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {privacy.twoFactorAuth && <Badge variant="secondary" className="bg-auction-live text-white">Enabled</Badge>}
                      <Switch
                        checked={privacy.twoFactorAuth}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, twoFactorAuth: checked }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>
              </div>
              
              <Button onClick={handlePrivacyUpdate} className="btn-hero">
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Payments
              </CardTitle>
              <CardDescription>Manage your payment methods and billing information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/26</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Primary</Badge>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">Add Payment Method</Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Billing History</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Seller Fee - December 2024</p>
                      <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$24.50</p>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Seller Fee - November 2024</p>
                      <p className="text-sm text-muted-foreground">Nov 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$18.75</p>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Account Status</h3>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Standard Account</p>
                    <p className="text-sm text-muted-foreground">5% seller fee • No listing limits</p>
                  </div>
                  <Button variant="outline">Upgrade to Premium</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}