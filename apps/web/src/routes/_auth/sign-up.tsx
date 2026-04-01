import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import SignUpForm from "./-components/sign-up-form";

export const Route = createFileRoute("/_auth/sign-up")({
	beforeLoad: async ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: SignUpPage,
});

function SignUpPage() {
	const navigate = useNavigate();
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<SignUpForm onSwitchToSignIn={() => navigate({ to: "/sign-in" })} />
			</div>
		</div>
	);
}
