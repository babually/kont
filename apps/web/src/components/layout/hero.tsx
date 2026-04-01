import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@kont/ui/components/avatar";
import { Button } from "@kont/ui/components/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
	return (
		<section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20 text-center">
			{/* Background Shapes */}
			<div className="absolute top-[20%] left-[-10%] -z-10 aspect-square w-[40%] rounded-full bg-[#f5e6d3] opacity-60 blur-[100px]" />
			<div className="absolute right-[-5%] bottom-[-10%] -z-10 aspect-square w-[35%] rounded-full bg-[#ecd9c6] opacity-50 blur-[80px]" />
			<div className="absolute top-[-5%] right-[-10%] -z-10 aspect-square w-[50%] rounded-full bg-[#f8ede3] opacity-70 blur-[120px]" />

			{/* Small floating dots for texture */}
			<div className="absolute top-[30%] left-[15%] h-3 w-3 rounded-full bg-primary/20 blur-sm" />
			<div className="absolute right-[20%] bottom-[40%] h-2 w-2 rounded-full bg-primary/30 blur-xs" />
			<div className="absolute top-[60%] right-[10%] h-4 w-4 rounded-full bg-secondary opacity-40 blur-md" />

			{/* Badge */}
			<div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border/50 bg-secondary px-4 py-1.5 font-medium text-muted-foreground text-xs">
				<span className="text-primary">✨</span> Your relationships,
				thoughtfully organized
			</div>

			{/* Headline */}
			<h1 className="mb-6 max-w-4xl font-serif text-5xl leading-[1.1] tracking-tight md:text-7xl">
				Remember{" "}
				<span className="relative inline-block text-primary italic">
					every
					<svg
						className="absolute -bottom-2 left-0 h-2 w-full text-primary/40"
						preserveAspectRatio="none"
						viewBox="0 0 100 10"
					>
						<path
							d="M0 5 Q 25 0, 50 5 T 100 5"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeWidth="2"
						/>
					</svg>
				</span>{" "}
				conversation
			</h1>

			{/* Description */}
			<p className="mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
				Kont is the personal CRM that helps you nurture relationships with the
				people who matter most. Track interactions, set reminders, and never
				forget a detail.
			</p>

			{/* CTAs */}
			<div className="mb-16 flex flex-col items-center gap-4 sm:flex-row">
				<Button className="h-12 gap-2 rounded-full px-8 text-base" size="lg">
					Start for free <ArrowRight className="h-4 w-4" />
				</Button>
				<Button
					className="h-12 rounded-full border-border/60 px-8 text-base"
					size="lg"
					variant="outline"
				>
					See how it works
				</Button>
			</div>

			{/* Social Proof */}
			<div className="flex flex-col items-center gap-4">
				<div className="flex -space-x-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<Avatar className="h-10 w-10 border-2 border-background" key={i}>
							<AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
					))}
				</div>
				<p className="text-muted-foreground text-sm">
					<span className="font-semibold text-foreground">2,500+</span> people
					nurturing better relationships
				</p>
			</div>
		</section>
	);
}
