"use client";
import { CheckIcon } from "@heroicons/react/24/outline";

const plans = [
  {
    id: "trial",
    name: "Free Trial",
    price: "₦0",
    duration: "60 min",
    tag: "First session only",
    description:
      "One complimentary session to experience the teaching style, ask questions, and decide if Cubicle is the right fit.",
    features: [
      "Full 60-minute lesson",
      "WhatsApp chat with instructor",
      "Google Meet video call",
      "Limited to one per student",
    ],
    cta: "Claim free trial",
    accent: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "₦15,000",
    duration: "60 min",
    tag: "Most popular",
    description:
      "A focused single session for targeted help on a topic, exam prep, or to maintain consistent progress week by week.",
    features: [
      "60-minute lesson",
      "Pre-lesson goal review",
      "Google Meet video call",
      "WhatsApp reminder 1hr before",
    ],
    cta: "Book a lesson",
    accent: true,
  },
  {
    id: "intensive",
    name: "Intensive",
    price: "₦25,000",
    duration: "90 min",
    tag: "Deep dive",
    description:
      "Extended sessions for complex topics, project walkthroughs, or students who prefer longer, deeper exploration.",
    features: [
      "90-minute lesson",
      "Pre-lesson goal review",
      "Google Meet video call",
      "WhatsApp reminder 1hr before",
    ],
    cta: "Book intensive",
    accent: false,
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-[114px] px-6 bg-[#f5f0ec] border-y border-border-warm"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-[72px]">
          <h2 className="font-heading text-[clamp(48px,8vw,80px)] font-bold text-dark-charcoal leading-[1.1] tracking-[-0.5px]">
            Simple,{" "}
            <span className="bg-[linear-gradient(transparent_65%,var(--color-chip-orange)_65%,var(--color-chip-orange)_100%)] px-1 -mx-1">
              transparent pricing
            </span>
          </h2>
        </div>

        <div className="flex flex-col min-[901px]:flex-row gap-6 justify-center items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col gap-0 relative ${
                plan.id === "standard" 
                  ? "py-14 px-8 bg-oboe-black border-none z-10 scale-100 min-[901px]:scale-[1.05] shadow-[0_30px_60px_-15px_rgba(42,37,34,0.2)]" 
                  : (plan.id === "intensive" 
                      ? "py-12 px-8 bg-surface-base border-2 border-dark-charcoal z-0 scale-100 shadow-brutal" 
                      : "py-12 px-8 bg-white border border-border-warm z-0 scale-100 shadow-none")
              } rounded-3xl transition-all duration-250 ease-in-out`}
            >
              {plan.tag && (
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold font-body tracking-[0.5px] uppercase mb-6 self-start ${
                    plan.accent ? "bg-cta-yellow text-oboe-black" : (plan.id === "intensive" ? "bg-dark-charcoal text-white" : "bg-user-bubble text-oboe-black")
                  }`}
                >
                  {plan.tag}
                </span>
              )}

              <h3 className={`font-heading text-2xl font-bold mb-2 ${plan.accent ? "text-white" : "text-dark-charcoal"}`}>
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className={`font-heading text-5xl font-bold leading-none ${plan.accent ? "text-cta-yellow" : "text-oboe-black"}`}>
                  {plan.price}
                </span>
              </div>

              <span className={`font-body text-xs font-light mb-5 text-placeholder-brown`}>
                {plan.duration} session
              </span>

              <p className={`font-body text-sm font-light leading-[1.7] mb-7 ${plan.accent ? "text-[#d6cdc9]" : "text-mid-gray-brown"}`}>
                {plan.description}
              </p>

              <ul className="list-none flex flex-col gap-2.5 mb-9 grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`font-body text-sm font-light flex items-center gap-2.5 ${plan.accent ? "text-[#d6cdc9]" : "text-mid-gray-brown"}`}>
                    <CheckIcon className={`w-4 h-4 shrink-0 ${plan.accent ? "text-cta-yellow" : "text-placeholder-brown"}`} />
                    <span className="pt-0.5">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup?redirect=/dashboard/book"
                id={`pricing-cta-${plan.id}`}
                className={`inline-flex items-center justify-center py-[13px] px-6 rounded-full font-body text-sm font-medium transition-all duration-200 cursor-pointer no-underline text-oboe-black border ${
                  plan.accent ? "bg-cta-yellow border-transparent" : "bg-transparent border-border-warm"
                } ${
                  plan.id === "trial" ? "hover:bg-chip-yellow hover:border-border-warm" : 
                  (plan.id === "standard" ? "hover:bg-chip-pink hover:text-dark-charcoal hover:border-transparent" : "hover:bg-highlight-blue hover:border-dark-charcoal")
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
