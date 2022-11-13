import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";

test("Ensure the app loads", async () => {
	await act(async () => render(<App />));
	// Find if ID "profilePic" exists
	const app = screen.getByTestId("App");
	expect(app).toBeInTheDocument();
});
