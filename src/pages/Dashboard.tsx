import { useState } from "react";
import { 
  TrendingUp, 
  Gavel, 
  Eye, 
  DollarSign, 
  Clock, 
  Trophy,
  Calendar,
  Heart,
  Settings,
  User,
  History
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalBids: number;
  activeBids: number;
  wonAuctions: number;
  totalSpent: number;
  myAuctions: number;
  watchlistItems: number;
}

interface RecentActivity {
  id: string;
  type: 'bid' | 'won' | 'outbid' | 'watched';
  auctionTitle: string;
  amount?: number;
  timestamp: Date;
  status: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData] = useState(() => {
    const stored = localStorage.getItem("user-data");
    return stored ? JSON.parse(stored) : { name: "John Doe", email: "john@example.com", username: "johndoe" };
  });

  const stats: DashboardStats = {
    totalBids: 24,
    activeBids: 5,
    wonAuctions: 3,
    totalSpent: 15750,
    myAuctions: 2,
    watchlistItems: 12
  };

  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "bid",
      auctionTitle: "Vintage Rolex Submariner",
      amount: 8500,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "leading"
    },
    {
      id: "2", 
      type: "outbid",
      auctionTitle: "Original Picasso Sketch",
      amount: 18000,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "outbid"
    },
    {
      id: "3",
      type: "won",
      auctionTitle: "Antique Persian Rug",
      amount: 3200,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "won"
    },
    {
      id: "4",
      type: "watched",
      auctionTitle: "1960s Gibson Les Paul",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "scheduled"
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bid': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'won': return <Trophy className="h-4 w-4 text-green-500" />;
      case 'outbid': return <Gavel className="h-4 w-4 text-red-500" />;
      case 'watched': return <Heart className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'leading': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'outbid': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'won': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your auctions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gavel className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalBids}</p>
                <p className="text-xs text-muted-foreground">Total Bids</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.activeBids}</p>
                <p className="text-xs text-muted-foreground">Active Bids</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.wonAuctions}</p>
                <p className="text-xs text-muted-foreground">Won</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.myAuctions}</p>
                <p className="text-xs text-muted-foreground">My Auctions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.watchlistItems}</p>
                <p className="text-xs text-muted-foreground">Watchlist</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest bidding activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <p className="font-medium">{activity.auctionTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.amount && `$${activity.amount.toLocaleString()} • `}
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getActivityColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Profile */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <p className="text-sm text-muted-foreground">@{userData.username}</p>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="btn-hero w-full justify-start"
                onClick={() => navigate("/auctions")}
              >
                <Gavel className="h-4 w-4 mr-2" />
                Browse Auctions
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/my-auctions")}
              >
                <User className="h-4 w-4 mr-2" />
                My Auctions
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/watchlist")}
              >
                <Heart className="h-4 w-4 mr-2" />
                Watchlist
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/create-auction")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Create Auction
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="mt-8">
        <Tabs defaultValue="active-bids" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active-bids">Active Bids</TabsTrigger>
            <TabsTrigger value="won-auctions">Won Auctions</TabsTrigger>
            <TabsTrigger value="my-auctions">My Auctions</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active-bids" className="mt-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Active Bids</CardTitle>
                <CardDescription>Auctions where you have active bids</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You have 5 active bids</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/auctions?filter=my-bids")}
                  >
                    View All Active Bids
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="won-auctions" className="mt-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Won Auctions</CardTitle>
                <CardDescription>Auctions you've successfully won</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You've won 3 auctions</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/won-auctions")}
                  >
                    View Won Auctions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-auctions" className="mt-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>My Auctions</CardTitle>
                <CardDescription>Auctions you've created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You have 2 active auctions</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/my-auctions")}
                  >
                    Manage My Auctions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist" className="mt-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Watchlist</CardTitle>
                <CardDescription>Auctions you're watching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You're watching 12 auctions</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/watchlist")}
                  >
                    View Watchlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}