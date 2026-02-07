"use client";

import { isAuthenticated } from "@/app/common/services/pocketbase.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mountain,
  Package,
  Recycle,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const services = [
  {
    icon: Recycle,
    title: "Full Resole",
    description:
      "Complete replacement of worn rubber with premium Vibram or Unparallel rubber. Restore your shoes to like-new performance.",
    price: "From $45",
  },
  {
    icon: Sparkles,
    title: "Rand Repair",
    description:
      "Fix worn toe rand before it damages the shoe. Extends the life of your shoes and prevents costly repairs.",
    price: "From $25",
  },
  {
    icon: Shield,
    title: "Heel Patch",
    description:
      "Targeted heel repairs for aggressive downturned shoes. Keep your heel hooks sharp and precise.",
    price: "From $20",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Submit Form",
    description:
      "Fill out our simple resole form with your shoe details and preferences.",
  },
  {
    step: "02",
    title: "Ship Your Shoes",
    description:
      "Send us your climbing shoes using our prepaid shipping label.",
  },
  {
    step: "03",
    title: "Expert Resole",
    description:
      "Our craftsmen meticulously resole your shoes with premium materials.",
  },
  {
    step: "04",
    title: "Climb Again",
    description:
      "Receive your restored shoes ready for your next climbing adventure.",
  },
];

const testimonials = [
  {
    name: "Alex K.",
    role: "V10 Climber",
    content:
      "SOS brought my favorite Muiras back to life. The rubber feels even better than factory!",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "Route Setter",
    content:
      "Quick turnaround and outstanding quality. I've sent all my worn shoes to SOS.",
    rating: 5,
  },
  {
    name: "Mike D.",
    role: "Gym Owner",
    content:
      "We recommend SOS to all our members. Sustainable, affordable, and professional.",
    rating: 5,
  },
];

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <div>
      {/* Hero Section - Full Screen */}
      <section className="relative overflow-hidden w-screen py-20 lg:py-32">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Mountain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  Ontario&apos;s Trusted Resole Service
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  Give Your Shoes
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  A Second Summit
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Professional climbing shoe resoling with premium Vibram and
                Unparallel rubber. Extend the life of your favorite kicks
                sustainably and affordably.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/resole-form">
                  <Button size="lg" className="group text-lg px-8 py-6">
                    Start Your Resole
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {!isLoggedIn && (
                  <>
                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 py-6">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 py-6">
                        Create Account
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold">
                      {i}K
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold">4,000+ Shoes Resoled</p>
                  <p className="text-sm text-muted-foreground">
                    Join our climbing community
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Decorative rings */}
                <div
                  className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-spin"
                  style={{ animationDuration: "30s" }}
                />
                <div
                  className="absolute inset-8 border-2 border-dashed border-primary/10 rounded-full animate-spin"
                  style={{
                    animationDuration: "25s",
                    animationDirection: "reverse",
                  }}
                />

                {/* Main image container */}
                <div className="absolute inset-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
                  <div className="text-center space-y-2 p-8">
                    <Mountain className="w-16 h-16 mx-auto text-primary" />
                    <p className="text-2xl font-bold">SOS</p>
                    <p className="text-sm text-muted-foreground">
                      Summit Outdoor Store
                    </p>
                  </div>
                </div>

                {/* Floating badges */}
                <div
                  className="absolute top-0 right-10 bg-card border shadow-lg rounded-xl px-4 py-3 animate-bounce"
                  style={{ animationDuration: "3s" }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      2-Week Turnaround
                    </span>
                  </div>
                </div>

                <div
                  className="absolute bottom-10 left-0 bg-card border shadow-lg rounded-xl px-4 py-3 animate-bounce"
                  style={{ animationDuration: "3.5s" }}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      Quality Guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From complete resoles to targeted repairs, we have the solution
              for every worn shoe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2 border-primary/10 hover:border-primary/30">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {service.price}
                    </span>
                    <Link href="/resole-form">
                      <Button variant="ghost" size="sm" className="group/btn">
                        Get Started
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting your shoes resoled is simple. Follow these four easy
              steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <div key={index} className="relative group">
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}

                <div className="space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-3xl font-bold group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold">
              What Climbers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of climbers across Ontario and beyond.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-lg mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <CardContent className="relative py-16 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <Package className="w-16 h-16 mx-auto opacity-90" />
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Ready to Resole?
                </h2>
                <p className="text-xl opacity-90">
                  Don&apos;t let worn rubber hold you back. Get your climbing
                  shoes feeling brand new again.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link href="/resole-form">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="text-lg px-8 py-6 group">
                      Start Your Order
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      Contact Us
                    </Button>
                  </Link>
                </div>

                <div className="flex justify-center gap-8 pt-8 text-sm opacity-80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Premium Rubber</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>2-Week Turnaround</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
