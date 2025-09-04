import { ArrowRight, Shield, Zap, Users, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/auction-hero.jpg";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Bidding",
      description: "Experience lightning-fast bidding with instant updates and notifications."
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Your transactions are protected with enterprise-grade security."
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Join thousands of collectors and sellers from around the world."
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Where <span className="text-primary">Exceptional Items</span>
              <br />
              Find Their Perfect Owner
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Discover rare treasures, place winning bids, and connect with a global community of passionate collectors in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auctions">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Browse Auctions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Zap className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 hidden lg:block">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-primary" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AuctionHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of online auctions with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">About AuctionHub</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              AuctionHub is the premier destination for online auctions, connecting collectors, sellers, and enthusiasts from around the globe. Our platform combines the excitement of traditional auctions with modern technology, offering real-time bidding, secure transactions, and an unparalleled user experience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're seeking rare collectibles, unique art pieces, or looking to sell your treasured items, AuctionHub provides the perfect marketplace to make it happen.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Live Auctions</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Appraisals</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Consignment</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Authentication</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Buyer's Guide</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Seller's Guide</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@auctionhub.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>New York, NY 10001</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}