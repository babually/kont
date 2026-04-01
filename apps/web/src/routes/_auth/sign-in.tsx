import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import SignInForm from "./-components/sign-in-form";

export const Route = createFileRoute("/_auth/sign-in")({
	beforeLoad: async ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SignInPage,
});

function SignInPage() {
	const navigate = useNavigate();
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<SignInForm onSwitchToSignUp={() => navigate({ to: "/sign-up" })} />
			</div>
		</div>
	);
}
