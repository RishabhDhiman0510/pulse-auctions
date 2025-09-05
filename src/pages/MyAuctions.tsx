import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, Calendar, DollarSign, Users } from "lucide-react";

interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  endDate: string;
  status: "live" | "scheduled" | "ended";
  bidCount: number;
  image: string;
  views: number;
}

const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Vintage Rolex Submariner",
    description: "Rare 1960s Rolex Submariner in excellent condition",
    currentBid: 12500,
    startingBid: 8000,
    endDate: "2024-12-25T18:00:00",
    status: "live",
    bidCount: 24,
    image: "/placeholder.svg",
    views: 156
  },
  {
    id: "2", 
    title: "Modern Art Painting",
    description: "Contemporary abstract painting by emerging artist",
    currentBid: 0,
    startingBid: 500,
    endDate: "2024-12-30T15:00:00",
    status: "scheduled",
    bidCount: 0,
    image: "/placeholder.svg",
    views: 42
  },
  {
    id: "3",
    title: "Antique Persian Rug",
    description: "Handwoven Persian rug from the 19th century",
    currentBid: 3200,
    startingBid: 1500,
    endDate: "2024-12-20T20:00:00",
    status: "ended",
    bidCount: 18,
    image: "/placeholder.svg",
    views: 203
  }
];

export default function MyAuctions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="status-live">Live</Badge>;
      case "scheduled":
        return <Badge className="status-scheduled">Scheduled</Badge>;
      case "ended":
        return <Badge className="status-ended">Ended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && auction.status === selectedTab;
  });

  const getTabCounts = () => {
    return {
      all: mockAuctions.length,
      live: mockAuctions.filter(a => a.status === "live").length,
      scheduled: mockAuctions.filter(a => a.status === "scheduled").length,
      ended: mockAuctions.filter(a => a.status === "ended").length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Auctions</h1>
          <p className="text-muted-foreground">Manage your auction listings and track their performance.</p>
        </div>
        <Link to="/create-auction">
          <Button className="btn-hero">
            <Plus className="h-4 w-4 mr-2" />
            Create Auction
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="live">Live ({tabCounts.live})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({tabCounts.scheduled})</TabsTrigger>
          <TabsTrigger value="ended">Ended ({tabCounts.ended})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredAuctions.length === 0 ? (
            <Card className="card-elegant">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No auctions found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedTab === "all" 
                      ? "You haven't created any auctions yet."
                      : `No ${selectedTab} auctions found.`
                    }
                  </p>
                  <Link to="/create-auction">
                    <Button className="btn-hero">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Auction
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAuctions.map((auction) => (
                <Card key={auction.id} className="card-elegant hover:card-glow transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {getStatusBadge(auction.status)}
                        <CardTitle className="mt-2 text-lg">{auction.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{auction.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Auction
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Auction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={auction.image} 
                        alt={auction.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            ${auction.currentBid > 0 ? auction.currentBid.toLocaleString() : auction.startingBid.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">
                            {auction.currentBid > 0 ? "Current" : "Starting"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{auction.bidCount}</p>
                          <p className="text-muted-foreground">Bids</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{auction.views}</p>
                          <p className="text-muted-foreground">Views</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {new Date(auction.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-muted-foreground">
                            {auction.status === "ended" ? "Ended" : "Ends"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/auction/${auction.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {auction.status !== "ended" && (
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}