import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Users, Wallet, Zap, Shield, Globe } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      id: "general",
      title: "General",
      icon: <HelpCircle className="h-5 w-5" />,
      color: "bg-blue-500",
      questions: [
        {
          question: "What is DotPOAP and how is it different from regular POAPs?",
          answer: "DotPOAP is a Proof-of-Attendance Protocol built specifically for the Polkadot ecosystem. Unlike Ethereum-based POAPs, DotPOAP offers near-zero transaction fees, faster processing, and is designed for African grassroots communities with localized features and accessibility."
        },
        {
          question: "What network does DotPOAP use?",
          answer: "DotPOAP operates on Asset Hub Paseo Testnet, a specialized parachain optimized for NFTs and digital assets. This ensures low fees and fast transactions while maintaining full Polkadot ecosystem compatibility."
        },
        {
          question: "How much does it cost to create and distribute DotPOAPs?",
          answer: "Creating events and minting DotPOAPs costs minimal fees (typically under $0.01 USD equivalent in PAS tokens). This makes it affordable for grassroots communities and large-scale events alike."
        }
      ]
    },
    {
      id: "wallets",
      title: "Wallets & Connection",
      icon: <Wallet className="h-5 w-5" />,
      color: "bg-green-500",
      questions: [
        {
          question: "Which wallets are supported?",
          answer: "DotPOAP supports all major Polkadot wallets including: Polkadot.js Extension (Official browser extension), Talisman (Multi-chain wallet), SubWallet (Comprehensive non-custodial wallet), and Nova Wallet (Next-generation mobile wallet)."
        },
        {
          question: "How do I connect my wallet?",
          answer: "Click the 'Connect Wallet' button in the navigation bar, select your preferred wallet from the list, and authorize the connection in your browser extension. Make sure you have a Polkadot-compatible wallet installed."
        }
      ]
    },
    {
      id: "creators",
      title: "Event Creators",
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-500",
      questions: [
        {
          question: "How do I create an event and issue DotPOAPs?",
          answer: "1. Connect your Polkadot wallet, 2. Navigate to 'Create Event', 3. Fill in event details, 4. Upload your custom POAP design (PNG/JPG, 500x500px recommended), 5. Set distribution parameters, 6. Deploy your event smart contract."
        },
        {
          question: "What file formats are supported for POAP designs?",
          answer: "Supported formats: PNG, JPG, JPEG, SVG. Recommended size: 500x500 pixels. Maximum file size: 5MB. Design guidelines: High contrast, clear text, recognizable at small sizes."
        },
        {
          question: "Can I use DotPOAP for virtual events?",
          answer: "Absolutely! DotPOAP supports both physical and virtual events. For virtual events, you can distribute POAPs via direct wallet addresses, QR codes in video calls, email lists, or integration with event platforms."
        }
      ]
    },
    {
      id: "collectors",
      title: "Collectors",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-orange-500",
      questions: [
        {
          question: "How do attendees claim their DotPOAPs?",
          answer: "Attendees can claim DotPOAPs by: scanning a QR code at the event, entering a claim code from organizers, having organizers mint directly to their wallet, or using the self-service claim portal."
        },
        {
          question: "Are DotPOAPs transferable or tradeable?",
          answer: "DotPOAPs are designed as non-transferable proof-of-attendance tokens. They remain permanently associated with the original recipient's wallet to maintain authenticity and prevent speculation."
        },
        {
          question: "How can I view my collected DotPOAPs?",
          answer: "Visit the 'My POAPs' section after connecting your wallet. You'll see all your collected DotPOAPs with event details, dates, and the ability to share your collection."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-yellow-500",
      questions: [
        {
          question: "How can I integrate DotPOAP with my existing event management system?",
          answer: "DotPOAP provides APIs and webhooks for integration with popular event platforms. Contact our team for custom integration support or check our developer documentation for self-service options."
        },
        {
          question: "What smart contract technology does DotPOAP use?",
          answer: "DotPOAP uses ink! smart contracts, Polkadot's native smart contract framework. This provides better performance, lower costs, and seamless integration with the Polkadot ecosystem."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to know about DotPOAP, from getting started to advanced features
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {faqCategories.map((category) => (
                <Badge key={category.id} variant="secondary" className="text-sm">
                  {category.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category) => (
              <Card key={category.id} className="mb-8 border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.id === "general" && "Basic information about DotPOAP"}
                    {category.id === "wallets" && "Wallet setup and connection help"}
                    {category.id === "creators" && "Guide for event organizers"}
                    {category.id === "collectors" && "Information for POAP collectors"}
                    {category.id === "technical" && "Technical integration details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Reach out to our community or development team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://forum.polkadot.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Globe className="h-4 w-4" />
                Join Polkadot Forum
              </a>
              <a
                href="mailto:allangithaiga5@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
