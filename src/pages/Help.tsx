import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Phone, Mail, HelpCircle, BookOpen, Video, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const faqData = [
  {
    id: "1",
    question: "How do I place a bid on an auction?",
    answer: "To place a bid, navigate to the auction page and enter your bid amount in the bidding section. Make sure your bid is higher than the current bid plus the minimum increment. Click 'Place Bid' to submit.",
    category: "Bidding"
  },
  {
    id: "2",
    question: "What happens if I win an auction?",
    answer: "If you win an auction, you'll receive an email notification with payment instructions. You'll have 48 hours to complete payment and arrange pickup or delivery with the seller.",
    category: "Winning"
  },
  {
    id: "3",
    question: "How do I create my first auction listing?",
    answer: "Click 'Create Auction' from your dashboard, fill in the item details, set your starting price and auction duration, upload photos, and submit for review. Your auction will go live once approved.",
    category: "Selling"
  },
  {
    id: "4",
    question: "What fees do I pay as a seller?",
    answer: "We charge a 5% final value fee on successful auctions. There are no listing fees for standard accounts. Premium accounts have reduced fees and additional features.",
    category: "Selling"
  },
  {
    id: "5",
    question: "How can I track auctions I'm interested in?",
    answer: "Use the 'Add to Watchlist' button on any auction page. You can view all your watched auctions in the Watchlist section of your dashboard and receive notifications about their progress.",
    category: "Watching"
  },
  {
    id: "6",
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards, PayPal, bank transfers, and cryptocurrency for high-value items. Payment must be completed within 48 hours of winning an auction.",
    category: "Payment"
  },
  {
    id: "7",
    question: "How do I verify the authenticity of items?",
    answer: "We offer professional authentication services for luxury items over $1,000. Look for the 'Authenticated' badge on listings. You can also request authentication during the listing process.",
    category: "Authentication"
  },
  {
    id: "8",
    question: "What is the return policy?",
    answer: "Returns are handled between buyers and sellers. We recommend reviewing item descriptions carefully. For authenticated items, we offer a 7-day return policy if the item doesn't match the description.",
    category: "Returns"
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const categories = ["all", "Bidding", "Selling", "Watching", "Payment", "Authentication", "Returns", "Winning"];

  const filteredFAQ = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "We've received your message and will respond within 24 hours.",
    });
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const handleFormChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-muted-foreground">Find answers to common questions or get in touch with our support team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Support Options */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-elegant">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Get instant help from our support team</p>
                <Button className="btn-hero">Start Chat</Button>
              </CardContent>
            </Card>
            
            <Card className="card-elegant">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Speak directly with our experts</p>
                <Button variant="outline">Call Now</Button>
              </CardContent>
            </Card>
            
            <Card className="card-elegant">
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Video Guides</h3>
                <p className="text-sm text-muted-foreground mb-4">Watch step-by-step tutorials</p>
                <Button variant="outline">Watch Videos</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Search our knowledge base for quick answers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "btn-hero" : ""}
                    >
                      {category === "all" ? "All" : category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion */}
              {filteredFAQ.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or browse all categories.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQ.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span>{faq.question}</span>
                          <Badge variant="secondary" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>Can't find what you're looking for? Send us a message.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => handleFormChange("subject", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => handleFormChange("message", e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full btn-hero">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="card-elegant mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Other Ways to Reach Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@auctionhub.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}