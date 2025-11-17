import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Digital Entrepreneur",
    content: "Ron Stone Bank transformed how I manage my international business. The multi-currency accounts and instant transfers are game-changers. I've saved thousands in fees.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    content: "The mobile app is incredibly intuitive and the security features give me peace of mind. Opening my account took just 3 minutes. This is banking done right.",
    rating: 5,
    avatar: "DC",
  },
  {
    name: "Emma Rodriguez",
    role: "Travel Blogger",
    content: "As someone who travels constantly, having access to local currencies without the crazy exchange fees has been incredible. The customer support is also top-notch.",
    rating: 5,
    avatar: "ER",
  },
  {
    name: "James Wilson",
    role: "Small Business Owner",
    content: "Switching to Ron Stone Bank was the best financial decision for my business. The transparent pricing and powerful features help me focus on growth, not banking headaches.",
    rating: 5,
    avatar: "JW",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 lg:py-32" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Loved by <span className="text-gradient-gold">Customers</span> Everywhere
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our customers have to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-elegant group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/50 rounded-full flex items-center justify-center">
                  <span className="font-bold text-accent-foreground">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
