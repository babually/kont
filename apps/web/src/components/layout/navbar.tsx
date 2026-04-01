import { Button } from "@kont/ui/components/button";
import { Link } from "@tanstack/react-router";

export function Navbar() {
	return (
		<nav className="fixed left-1/2 z-50 flex w-[95%] max-w-5xl -translate-x-1/2 animate-fade-in items-center justify-between rounded-full border border-white/20 bg-background/40 px-8 py-3 shadow-black/5 shadow-lg backdrop-blur-xl">
			<div className="group flex cursor-pointer items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground transition-transform group-hover:scale-110">
					K
				</div>
				<span className="font-bold font-serif text-xl tracking-tight">
					Kont
				</span>
			</div>

			{/* <div className="hidden md:flex items-center gap-10">
        <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Features</a>
        <a href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">How It Works</a>
        <a href="#testimonials" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Testimonials</a>
      </div> */}

			<div className="flex items-center gap-6">
				<button className="font-semibold text-sm transition-colors hover:text-primary">
					<Link to="/sign-in">Sign In</Link>
				</button>
				<Button className="h-auto rounded-full px-7 py-5 font-bold text-sm shadow-elegant transition-all hover:scale-105 active:scale-95">
					<Link to="/sign-up">Get Started</Link>
				</Button>
			</div>
		</nav>
	);
}
