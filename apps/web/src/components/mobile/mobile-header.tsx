export function MobileHeader() {
	return (
		<header className="flex items-center gap-3 bg-card px-4 py-5 md:hidden">
			<div className="group flex cursor-pointer items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground transition-transform group-hover:scale-110">
					K
				</div>
				<span className="font-bold font-serif text-xl tracking-tight">
					Kont
				</span>
			</div>
			{/* <img src="/logo.png" alt="OutRay Logo" className="w-8" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm tracking-tight truncate">
          Kont
        </p>
      </div> */}
		</header>
	);
}
